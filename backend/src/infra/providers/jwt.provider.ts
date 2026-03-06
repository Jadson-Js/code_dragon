import type { IJWTProvider } from "@/domain/providers/jwt.provider";
import { UnauthorizedError } from "@/shared/app.error";
import { env } from "@/shared/env";
import { msToSeconds } from "@/shared/utils";
import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";

@injectable()
export class JwtProvider implements IJWTProvider {
  async generateAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, env.jwtAccessSecret, {
      expiresIn: msToSeconds(env.jwtAccessExpiresInMs),
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, env.jwtRefreshSecret, {
      expiresIn: msToSeconds(env.jwtRefreshExpiresInMs),
    });
  }

  async generateEmailVerificationToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, env.jwtEmailVerificationSecret, {
      expiresIn: msToSeconds(env.jwtEmailVerificationExpiresInMs),
    });
  }

  async generatePasswordResetToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, env.jwtResetPasswordSecret, {
      expiresIn: msToSeconds(env.jwtResetPasswordExpiresInMs),
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

  async verifyPasswordResetToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, env.jwtResetPasswordSecret);
      return true;
    } catch {
      return false;
    }
  }

  async decodeToken(
    token: string,
  ): Promise<{ sub: string; [key: string]: unknown }> {
    const decoded = jwt.decode(token) as {
      userId: string;
      [key: string]: unknown;
    } | null;

    if (!decoded) throw new UnauthorizedError("Malformed token");

    return { sub: decoded.userId, ...decoded };
  }
}
