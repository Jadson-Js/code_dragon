import { inject, injectable } from "tsyringe";
import type { IRedisProvider } from "@/domain/providers/redis.provider";
import { NotFoundError, TooManyRequestsError } from "@/shared/app.error";
import type { Request, Response, NextFunction } from "express";

export interface IRateLimit {
  max: number;
  windowInMs: number;
  key: string;
  useEmail?: boolean;
}

@injectable()
export class RateLimitMiddleware {
  constructor(
    @inject("IRedisProvider")
    private readonly redisProvider: IRedisProvider,
  ) {}

  handle(options: IRateLimit) {
    const windowInSeconds = Math.ceil(options.windowInMs / 1000);

    return async (
      request: Request,
      _response: Response,
      next: NextFunction,
    ) => {
      const ip = request.ip;
      if (!ip) throw new NotFoundError("IP not found");

      let redisKey = `ratelimit:${options.key}:${ip}`;

      if (options.useEmail && request.body?.email) {
        redisKey += `:${request.body.email}`;
      }

      const currentCount = await this.redisProvider.incr(redisKey);

      if (currentCount === 1) {
        await this.redisProvider.expire(redisKey, windowInSeconds);
      }

      if (currentCount > options.max) {
        throw new TooManyRequestsError();
      }

      next();
    };
  }
}
