import { inject, injectable } from "tsyringe";
import type { IRedisTokenRepository } from "@/domain/database/redis/token.repository";
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
    @inject("IRedisTokenRepository")
    private readonly redisTokenRepository: IRedisTokenRepository,
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

      const currentCount = await this.redisTokenRepository.incr(redisKey);

      if (currentCount === 1) {
        await this.redisTokenRepository.expire(redisKey, windowInSeconds);
      }

      if (currentCount > options.max) {
        throw new TooManyRequestsError();
      }

      next();
    };
  }
}
