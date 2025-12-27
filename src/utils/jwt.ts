import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-please-change-in-production";
const JWT_EXPIRES_IN = "1d";

export const jwttoken = {
  sign: (payload: JwtPayload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (e) {
      console.error("Failed to authenticate token", e);
      throw new Error("Failed to authenticate token");
    }
  },
  verify: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (e) {
      console.error("Failed to authenticate token", e);
      throw new Error("Failed to authenticate token");
    }
  },
};