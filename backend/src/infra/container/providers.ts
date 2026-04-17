import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";
import { EmailProvider } from "@/infra/providers/email/email.provider";
import { JwtProvider } from "@/infra/providers/jwt.provider";
import { CreateUserWithEmailTokenPrismaRepository } from "@/infra/database/prisma/auth/create-user-with-email-token.prisma.repository";
import { ResetPasswordPrismaRepository } from "@/infra/database/prisma/auth/reset-password.prisma.repository";
import { CreateProfileWithStacksPrismaRepository } from "../database/prisma/profile/create-profile-with-stacks.repository";
import { UpdateProfileWithStacksPrismaRepository } from "../database/prisma/profile/update-profile-with-stacks.repository";
import { GetProfileByUserIdPrismaRepository } from "../database/prisma/profile/get-profile-by-user-id.repository";
import { GetOnboardingOptionsPrismaRepository } from "../database/prisma/profile/get-onboarding-options.repository";
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
import type { IBaseQueueProvider } from "@/infra/providers/queue/base.bullmq.provider";
import type { ISendEmailProps } from "@/infra/providers/email/email.provider";
import type { IGenerateQuizQuestionByGeminiInputProvider } from "@/infra/providers/gemini.provider";
import { GetQuizContextPrismaRepository } from "../database/prisma/quiz/questions/get-quiz-context.prisma.repository";
import { FeaturePrismaRepository } from "../database/prisma/feature.prisma.repository";
import { QuizQuestionEventEmitter } from "../providers/quiz-question-event-emitter";
import { SessionQuizPrismaRepository } from "@/infra/database/prisma/session-quiz.prisma.repository";

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
container.registerSingleton(
  "ICreateProfileWithStacksRepository",
  CreateProfileWithStacksPrismaRepository,
);
container.registerSingleton(
  "IUpdateProfileWithStacksRepository",
  UpdateProfileWithStacksPrismaRepository,
);
container.registerSingleton(
  "IGetProfileByUserIdRepository",
  GetProfileByUserIdPrismaRepository,
);
container.registerSingleton(
  "getOnboardingOptionsRepository",
  GetOnboardingOptionsPrismaRepository,
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
container.registerSingleton("IFeatureRepository", FeaturePrismaRepository);
container.registerSingleton(
  "QuizQuestionEventEmitter",
  QuizQuestionEventEmitter,
);
container.registerSingleton(
  "ISessionQuizRepository",
  SessionQuizPrismaRepository,
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
