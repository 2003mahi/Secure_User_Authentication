import { type User, type InsertUser, type PublicUser, type SecurityActivity, type ApiKey, type UserSession } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<PublicUser>;
  updateLastLogin(id: string): Promise<void>;
  validateUserCredentials(email: string, password: string): Promise<PublicUser | null>;
  
  // Security Activities
  logSecurityActivity(userId: string, activity: string, metadata?: { ipAddress?: string; userAgent?: string; location?: string }): Promise<void>;
  getSecurityActivities(userId: string, limit?: number): Promise<SecurityActivity[]>;
  
  // API Keys
  createApiKey(userId: string, name: string, expiresAt?: Date): Promise<{ apiKey: ApiKey; keyValue: string }>;
  getApiKeys(userId: string): Promise<ApiKey[]>;
  revokeApiKey(userId: string, keyId: string): Promise<boolean>;
  validateApiKey(keyValue: string): Promise<{ userId: string; keyId: string } | null>;
  
  // User Sessions
  createSession(userId: string, deviceInfo?: string, ipAddress?: string, location?: string): Promise<UserSession>;
  getUserSessions(userId: string): Promise<UserSession[]>;
  revokeSession(userId: string, sessionId: string): Promise<boolean>;
  revokeAllSessions(userId: string): Promise<void>;
  
  // User Statistics
  getUserStats(userId: string): Promise<{
    totalLogins: number;
    activeSessions: number;
    apiKeysCount: number;
    securityScore: number;
    accountAge: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private securityActivities: Map<string, SecurityActivity>;
  private apiKeys: Map<string, ApiKey>;
  private userSessions: Map<string, UserSession>;
  private keyToUserMap: Map<string, { userId: string; keyId: string }>;

  constructor() {
    this.users = new Map();
    this.securityActivities = new Map();
    this.apiKeys = new Map();
    this.userSessions = new Map();
    this.keyToUserMap = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<PublicUser> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    
    const user: User = { 
      ...insertUser, 
      id,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      lastLogin: null,
    };
    
    this.users.set(id, user);
    
    // Return user without password
    const { password, ...publicUser } = user;
    return publicUser;
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLogin = new Date();
      this.users.set(id, user);
    }
  }

  async validateUserCredentials(email: string, password: string): Promise<PublicUser | null> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await this.updateLastLogin(user.id);

    // Return user without password
    const { password: _, ...publicUser } = user;
    return publicUser;
  }

  // Security Activities
  async logSecurityActivity(
    userId: string, 
    activity: string, 
    metadata?: { ipAddress?: string; userAgent?: string; location?: string }
  ): Promise<void> {
    const id = randomUUID();
    const securityActivity: SecurityActivity = {
      id,
      userId,
      activity,
      ipAddress: metadata?.ipAddress || null,
      userAgent: metadata?.userAgent || null,
      location: metadata?.location || null,
      timestamp: new Date(),
    };
    this.securityActivities.set(id, securityActivity);
  }

  async getSecurityActivities(userId: string, limit: number = 50): Promise<SecurityActivity[]> {
    return Array.from(this.securityActivities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  // API Keys
  async createApiKey(userId: string, name: string, expiresAt?: Date): Promise<{ apiKey: ApiKey; keyValue: string }> {
    const id = randomUUID();
    const keyValue = `sk_${randomUUID().replace(/-/g, '')}`;
    const keyHash = await bcrypt.hash(keyValue, SALT_ROUNDS);

    const apiKey: ApiKey = {
      id,
      userId,
      name,
      keyHash,
      lastUsed: null,
      expiresAt: expiresAt || null,
      createdAt: new Date(),
      isActive: "true",
    };

    this.apiKeys.set(id, apiKey);
    this.keyToUserMap.set(keyValue, { userId, keyId: id });

    // Log activity
    await this.logSecurityActivity(userId, `API key "${name}" created`);

    return { apiKey, keyValue };
  }

  async getApiKeys(userId: string): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values())
      .filter(key => key.userId === userId && key.isActive === "true")
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async revokeApiKey(userId: string, keyId: string): Promise<boolean> {
    const apiKey = this.apiKeys.get(keyId);
    if (!apiKey || apiKey.userId !== userId) {
      return false;
    }

    apiKey.isActive = "false";
    this.apiKeys.set(keyId, apiKey);

    // Remove from key mapping
    this.keyToUserMap.forEach((value, key) => {
      if (value.keyId === keyId) {
        this.keyToUserMap.delete(key);
      }
    });

    // Log activity
    await this.logSecurityActivity(userId, `API key "${apiKey.name}" revoked`);

    return true;
  }

  async validateApiKey(keyValue: string): Promise<{ userId: string; keyId: string } | null> {
    const mapping = this.keyToUserMap.get(keyValue);
    if (!mapping) return null;

    const apiKey = this.apiKeys.get(mapping.keyId);
    if (!apiKey || apiKey.isActive !== "true") return null;

    // Check if expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    // Update last used
    apiKey.lastUsed = new Date();
    this.apiKeys.set(mapping.keyId, apiKey);

    return mapping;
  }

  // User Sessions
  async createSession(userId: string, deviceInfo?: string, ipAddress?: string, location?: string): Promise<UserSession> {
    const id = randomUUID();
    const session: UserSession = {
      id,
      userId,
      deviceInfo: deviceInfo || null,
      ipAddress: ipAddress || null,
      location: location || null,
      isActive: "true",
      lastActivity: new Date(),
      createdAt: new Date(),
    };

    this.userSessions.set(id, session);

    // Log activity
    await this.logSecurityActivity(userId, "New session created", { ipAddress, location });

    return session;
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    return Array.from(this.userSessions.values())
      .filter(session => session.userId === userId && session.isActive === "true")
      .sort((a, b) => (b.lastActivity?.getTime() || 0) - (a.lastActivity?.getTime() || 0));
  }

  async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    const session = this.userSessions.get(sessionId);
    if (!session || session.userId !== userId) {
      return false;
    }

    session.isActive = "false";
    this.userSessions.set(sessionId, session);

    // Log activity
    await this.logSecurityActivity(userId, "Session revoked");

    return true;
  }

  async revokeAllSessions(userId: string): Promise<void> {
    let revokedCount = 0;
    Array.from(this.userSessions.entries()).forEach(([id, session]) => {
      if (session.userId === userId && session.isActive === "true") {
        session.isActive = "false";
        this.userSessions.set(id, session);
        revokedCount++;
      }
    });

    // Log activity
    await this.logSecurityActivity(userId, `All sessions revoked (${revokedCount} sessions)`);
  }

  // User Statistics
  async getUserStats(userId: string): Promise<{
    totalLogins: number;
    activeSessions: number;
    apiKeysCount: number;
    securityScore: number;
    accountAge: number;
  }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Count login activities
    const loginActivities = Array.from(this.securityActivities.values())
      .filter(activity => activity.userId === userId && activity.activity.includes("login"));

    // Count active sessions
    const activeSessions = Array.from(this.userSessions.values())
      .filter(session => session.userId === userId && session.isActive === "true").length;

    // Count active API keys
    const apiKeysCount = Array.from(this.apiKeys.values())
      .filter(key => key.userId === userId && key.isActive === "true").length;

    // Calculate security score (0-100)
    let securityScore = 50; // Base score
    
    // Strong password adds points
    if (user.password.length >= 12) securityScore += 15;
    
    // Having API keys adds security awareness
    if (apiKeysCount > 0) securityScore += 10;
    
    // Recent activity adds points
    const recentActivities = Array.from(this.securityActivities.values())
      .filter(activity => 
        activity.userId === userId && 
        activity.timestamp && 
        activity.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    
    if (recentActivities.length > 0) securityScore += 15;
    
    // Multiple sessions might be risky
    if (activeSessions > 3) securityScore -= 10;
    
    securityScore = Math.max(0, Math.min(100, securityScore));

    // Calculate account age in days
    const accountAge = user.createdAt 
      ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      totalLogins: loginActivities.length,
      activeSessions,
      apiKeysCount,
      securityScore,
      accountAge,
    };
  }
}

export const storage = new MemStorage();
