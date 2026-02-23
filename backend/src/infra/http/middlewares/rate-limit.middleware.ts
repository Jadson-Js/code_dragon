import { redisConnection } from "@/infra/providers/redisConnection";
import {
  InternalServerError,
  NotFoundError,
  TooManyRequestsError,
} from "@/shared/app.error";
import type { Request, Response, NextFunction } from "express";

export interface IRateLimit {
  max: number;
  windowInMs: number;
  key: string;
}

export function rateLimitMiddleware(options: IRateLimit) {
  const windowInSeconds = Math.ceil(options.windowInMs / 1000);

  return async (request: Request, _response: Response, next: NextFunction) => {
    const identifier = request.ip;
    if (!identifier) throw new NotFoundError("IP not found");

    const redisKey = `${options.key}=${identifier}:${request.body.email}`;

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
