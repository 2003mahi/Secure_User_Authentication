import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import { storage } from "../storage";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "24h";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export function generateToken(user: { id: string; email: string; username: string; role: string }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Access token is required" 
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }

  // Verify user still exists
  const user = await storage.getUser(decoded.id);
  if (!user) {
    return res.status(403).json({ 
      success: false, 
      message: "User not found" 
    });
  }

  req.user = {
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
    role: decoded.role,
  };

  next();
}
