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
import { RedisProvider } from "../providers/redis.provider";
import { RateLimitMiddleware } from "../http/middlewares/rate-limit.middleware";
import { SimpleRateLimitMiddleware } from "../http/middlewares/simple-rate-limit.middleware";
import { GeminiProvider } from "../providers/gemini.provider";
import { QuizQuestionPrismaRepository } from "@/infra/database/prisma/quiz-question.prisma.repository";
import { GenerateQuizQuestionBullMQProvider } from "../providers/queue/generate-quiz-question.provider";
import type { IBaseQueueProvider } from "@/domain/providers/queue/base.provider";
import type { ISendEmailProps } from "@/domain/providers/email/email.provider";
import type { IGenerateQuizQuestionByGeminiInputProvider } from "@/domain/providers/gemini.provider";
import { GetQuizContextPrismaRepository } from "../database/prisma/quiz/get-quiz-context.prisma.repository";

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
  "IGenerateQuizQuestionQueueProvider",
  GenerateQuizQuestionBullMQProvider,
);
container.registerSingleton("IEnsureAuthenticated", EnsureAuthenticated);
container.registerSingleton("IGeminiProvider", GeminiProvider);
container.registerSingleton(
  "IGetQuizQuestionContextRepository",
  GetQuizContextPrismaRepository,
);
container.registerSingleton(
  "IQuizQuestionRepository",
  QuizQuestionPrismaRepository,
);

export const emailQueueProvider = container.resolve<
  IBaseQueueProvider<ISendEmailProps>
>("IEmailQueueProvider");

export const generateQuizQuestionQueueProvider = container.resolve<
  IBaseQueueProvider<IGenerateQuizQuestionByGeminiInputProvider>
>("IGenerateQuizQuestionQueueProvider");

export const geminiProvider = container.resolve("IGeminiProvider");
export const ensureAuthenticated = container.resolve<IEnsureAuthenticated>(
  "IEnsureAuthenticated",
);
export const rateLimitMiddleware = container.resolve(RateLimitMiddleware);
export const simpleRateLimitMiddleware = container.resolve(
  SimpleRateLimitMiddleware,
);
