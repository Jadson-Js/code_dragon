import { rateLimit } from "express-rate-limit";
import { TooManyRequestsError } from "@/shared/app.error";

export interface ISimpleRateLimit {
  max: number;
  windowInMs: number;
}

export class SimpleRateLimitMiddleware {
  handle(options: ISimpleRateLimit) {
    return rateLimit({
      windowMs: options.windowInMs,
      max: options.max,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      handler: (_req, _res, _next) => {
        throw new TooManyRequestsError();
      },
      // Using memory store by default
    });
  }
}
