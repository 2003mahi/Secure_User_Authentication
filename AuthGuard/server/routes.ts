import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { generateToken, authenticateToken, type AuthRequest } from "./middleware/auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User Registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate input
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists"
        });
      }

      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(409).json({
          success: false,
          message: "User with this username already exists"
        });
      }

      // Create user
      const user = await storage.createUser(validatedData);
      
      // Log registration activity
      await storage.logSecurityActivity(user.id, "Account created", {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // User Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Validate input
      const validatedData = loginSchema.parse(req.body);
      
      // Validate credentials
      const user = await storage.validateUserCredentials(
        validatedData.email, 
        validatedData.password
      );
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Log login activity
      await storage.logSecurityActivity(user.id, "Successful login", {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      // Create session
      await storage.createSession(user.id, req.headers['user-agent'], req.ip);

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      });

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        expiresIn: "24h"
      });
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Protected route - Get user profile
  app.get("/api/user/profile", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const { password, ...publicUser } = user;
      
      res.json({
        success: true,
        user: {
          ...publicUser,
          permissions: ["read", "write"] // Example permissions
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Security Activities
  app.get("/api/user/security-activities", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activities = await storage.getSecurityActivities(req.user!.id, limit);
      
      res.json({
        success: true,
        activities
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // API Keys Management
  app.get("/api/user/api-keys", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const apiKeys = await storage.getApiKeys(req.user!.id);
      
      res.json({
        success: true,
        apiKeys: apiKeys.map(key => ({
          ...key,
          keyHash: undefined // Don't return the hash
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  app.post("/api/user/api-keys", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const createApiKeySchema = z.object({
        name: z.string().min(1, "API key name is required").max(100, "Name too long"),
        expiresInDays: z.number().optional()
      });

      const validatedData = createApiKeySchema.parse(req.body);
      
      const expiresAt = validatedData.expiresInDays 
        ? new Date(Date.now() + validatedData.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined;

      const { apiKey, keyValue } = await storage.createApiKey(req.user!.id, validatedData.name, expiresAt);
      
      res.status(201).json({
        success: true,
        message: "API key created successfully",
        apiKey: {
          ...apiKey,
          keyHash: undefined // Don't return the hash
        },
        keyValue // Only returned once on creation
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  app.delete("/api/user/api-keys/:keyId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { keyId } = req.params;
      const success = await storage.revokeApiKey(req.user!.id, keyId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "API key not found"
        });
      }
      
      res.json({
        success: true,
        message: "API key revoked successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Session Management
  app.get("/api/user/sessions", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const sessions = await storage.getUserSessions(req.user!.id);
      
      res.json({
        success: true,
        sessions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  app.delete("/api/user/sessions/:sessionId", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { sessionId } = req.params;
      const success = await storage.revokeSession(req.user!.id, sessionId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Session not found"
        });
      }
      
      res.json({
        success: true,
        message: "Session revoked successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  app.delete("/api/user/sessions", authenticateToken, async (req: AuthRequest, res) => {
    try {
      await storage.revokeAllSessions(req.user!.id);
      
      res.json({
        success: true,
        message: "All sessions revoked successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // User Statistics
  app.get("/api/user/stats", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const stats = await storage.getUserStats(req.user!.id);
      
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
