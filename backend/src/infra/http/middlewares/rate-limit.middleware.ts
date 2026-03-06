import { redisConnection } from "@/infra/providers/redisConnection";
import { NotFoundError, TooManyRequestsError } from "@/shared/app.error";
import type { Request, Response, NextFunction } from "express";

export interface IRateLimit {
  max: number;
  windowInMs: number;
  key: string;
  useEmail?: boolean;
}

export function rateLimitMiddleware(options: IRateLimit) {
  const windowInSeconds = Math.ceil(options.windowInMs / 1000);

  return async (request: Request, _response: Response, next: NextFunction) => {
    const ip = request.ip;
    if (!ip) throw new NotFoundError("IP not found");

    let redisKey = `ratelimit:${options.key}:${ip}`;

    if (options.useEmail && request.body?.email) {
      redisKey += `:${request.body.email}`;
    }

    const currentCount = await redisConnection.incr(redisKey);
    if (currentCount === 1) {
      await redisConnection.expire(redisKey, windowInSeconds);
    }
    if (currentCount > options.max) {
      throw new TooManyRequestsError();
    }
    next();
  };
}
