import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";
import { EmailProvider } from "@/infra/providers/email/email.provider";
import { JwtProvider } from "@/infra/providers/jwt.provider";
import { CreateUserWithEmailTokenPrismaRepository } from "@/infra/database/prisma/auth/create-user-with-email-token.prisma.repository";
import { ResetPasswordPrismaRepository } from "@/infra/database/prisma/auth/reset-password.prisma.repository";
import { EmailQueueProvider } from "../providers/email/bullmq.provider";
import {
  EnsureAuthenticated,
  type IEnsureAuthenticated,
} from "../http/middlewares/ensure-authenticated.middleware";
import type { IEmailQueueProvider } from "@/domain/providers/email/queue.provider";
import { RedisProvider } from "../providers/redis.provider";
import { RateLimitMiddleware } from "../http/middlewares/rate-limit.middleware";
import { SimpleRateLimitMiddleware } from "../http/middlewares/simple-rate-limit.middleware";

container.registerSingleton("IHashProvider", HashProvider);
container.registerSingleton("IEmailProvider", EmailProvider);
container.registerSingleton("IJWTProvider", JwtProvider);
container.registerSingleton("IRedisProvider", RedisProvider);
container.registerSingleton("RateLimitMiddleware", RateLimitMiddleware);
container.registerSingleton(
  "SimpleRateLimitMiddleware",
  SimpleRateLimitMiddleware,
);
container.registerSingleton(
  "ICreateUserWithEmailTokenRepository",
  CreateUserWithEmailTokenPrismaRepository,
);
container.registerSingleton(
  "IResetPasswordRepository",
  ResetPasswordPrismaRepository,
);
container.registerSingleton("IEmailQueueProvider", EmailQueueProvider);
container.registerSingleton("IEnsureAuthenticated", EnsureAuthenticated);

export const queueProvider = container.resolve<IEmailQueueProvider>(
  "IEmailQueueProvider",
);
export const ensureAuthenticated = container.resolve<IEnsureAuthenticated>(
  "IEnsureAuthenticated",
);
export const rateLimitMiddleware = container.resolve(RateLimitMiddleware);
export const simpleRateLimitMiddleware = container.resolve(
  SimpleRateLimitMiddleware,
);
