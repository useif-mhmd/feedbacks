import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader } from "../services/auth.js";
import { JWTPayload } from "../../shared/types.js";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // console.log(`🔐 Auth middleware - ${req.method} ${req.path}`);
    // console.log("Authorization header:", req.headers.authorization ? "Present" : "Missing");

    const token = extractTokenFromHeader(req.headers.authorization);
    const payload = verifyToken(token);
    req.user = payload;
    // console.log("✅ Authentication successful for user:", payload.userId);
    next();
  } catch (error) {
    console.log("❌ Authentication failed:", error instanceof Error ? error.message : "Unknown error");
    return res.status(401).json({
      success: false,
      message: "غير مصرح لك بالوصول - يرجى تسجيل الدخول",
      error: error instanceof Error ? error.message : "Authentication failed"
    });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      const payload = verifyToken(token);
      req.user = payload;
    }
    next();
  } catch (error) {
    // In optional auth, we just continue without setting req.user
    next();
  }
}
