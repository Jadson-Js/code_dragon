import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";
import { EmailProvider } from "@/infra/providers/email/email.provider";
import { JwtProvider } from "@/infra/providers/jwt.provider";
import { CreateUserWithEmailTokenPrismaRepository } from "@/infra/database/prisma/auth/create-user-with-email-token.prisma.repository";
import { ResetPasswordPrismaRepository } from "@/infra/database/prisma/auth/reset-password.prisma.repository";
import { EmailBullMQProvider } from "../providers/queue/email.bullmq.provider";
import {
  EnsureAuthenticated,
  type IEnsureAuthenticated,
} from "../http/middlewares/ensure-authenticated.middleware";
import type { IEmailQueueProvider } from "@/domain/providers/email/email-queue.provider";
import { RedisProvider } from "../providers/redis.provider";
import { RateLimitMiddleware } from "../http/middlewares/rate-limit.middleware";
import { SimpleRateLimitMiddleware } from "../http/middlewares/simple-rate-limit.middleware";
import { GeminiProvider } from "../providers/gemini.provider";
import { GetQuizContextPrismaRepository } from "@/infra/database/prisma/quiz/get-quiz-context.prisma.repository";
import { QuizQuestionPrismaRepository } from "@/infra/database/prisma/quiz-question.prisma.repository";
import { GenerateQuizQuestionBullMQProvider } from "../providers/queue/generate-quiz-question.provider";
import type { IBaseQueueProvider } from "@/domain/providers/queue/base.provider";

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
container.registerSingleton("IEmailQueueProvider", EmailBullMQProvider);
container.registerSingleton(
  "IGenerateQuizQuestionQueue",
  GenerateQuizQuestionBullMQProvider,
);
container.registerSingleton("IEnsureAuthenticated", EnsureAuthenticated);
container.registerSingleton("IGeminiProvider", GeminiProvider);
container.registerSingleton(
  "IGetQuizContextRepository",
  GetQuizContextPrismaRepository,
);
container.registerSingleton(
  "IQuizQuestionRepository",
  QuizQuestionPrismaRepository,
);

export const queueProvider = container.resolve<IEmailQueueProvider>(
  "IEmailQueueProvider",
);
export const geminiProvider = container.resolve("IGeminiProvider");
export const generateQuizQuestionQueueProvider = container.resolve<
  IBaseQueueProvider<any>
>("IGenerateQuizQuestionQueue");
export const ensureAuthenticated = container.resolve<IEnsureAuthenticated>(
  "IEnsureAuthenticated",
);
export const rateLimitMiddleware = container.resolve(RateLimitMiddleware);
export const simpleRateLimitMiddleware = container.resolve(
  SimpleRateLimitMiddleware,
);
