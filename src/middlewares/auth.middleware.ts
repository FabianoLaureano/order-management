import { jwttoken } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        message: "No access token provided",
      });
    }

    const decoded = jwttoken.verify(token);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "sub" in decoded &&
      typeof decoded.sub === "string"
    ) {
      req.user = { sub: decoded.sub };
      console.info(`User authenticated: ${decoded.sub}`);
      next();
    } else {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid token format or missing subject",
      });
    }
  } catch (e) {
    console.error("Authentication error:", e);

    if (e instanceof Error && e.message === "Failed to authenticate token") {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid or expired token",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: "Error during authentication",
    });
  }
};
