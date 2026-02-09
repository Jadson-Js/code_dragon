import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import { env } from "@/shared/env";
import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";

@injectable()
export class JwtProvider implements IJWTProvider {
  async generateAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, env.jwtAccessSecret, {
      expiresIn: env.jwtAccessExpiresIn,
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, env.jwtRefreshSecret, {
      expiresIn: env.jwtRefreshExpiresIn,
    });
  }

  async generateEmailVerificationToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, env.jwtEmailVerificationSecret, {
      expiresIn: env.jwtEmailVerificationExpiresIn,
    });
  }

  async verifyAccessToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, env.jwtAccessSecret);
      return true;
    } catch {
      return false;
    }
  }

  async verifyRefreshToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, env.jwtRefreshSecret);
      return true;
    } catch {
      return false;
    }
  }

  async verifyEmailVerificationToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, env.jwtEmailVerificationSecret);
      return true;
    } catch {
      return false;
    }
  }
}
