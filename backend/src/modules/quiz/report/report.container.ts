import { container } from "tsyringe";
import { QuizReportController } from "./report.controller";
import { QuizReportSubmitUseCase } from "./use-cases/submit.use-case";
import { QuizQuestionPrismaRepository } from "@/infra/database/prisma/quiz-question.prisma.repository";
import { SessionQuizResultPrismaRepository } from "@/infra/database/prisma/session-quiz-result.prisma.repository";
import { SessionQuizPrismaRepository } from "@/infra/database/prisma/session-quiz.prisma.repository";
import { SessionQuizSubjectPrismaRepository } from "@/infra/database/prisma/session-quiz-subject.prisma.repository";
import { SessionQuizStackPrismaRepository } from "@/infra/database/prisma/session-quiz-stack.prisma.repository";
import { GeminiProvider } from "@/infra/providers/gemini.provider";
import { GetQuizReportPrismaRepository } from "@/infra/database/prisma/quiz/report/get-quiz-report.prisma.repository";

// Register dependencies
container.registerSingleton(QuizQuestionPrismaRepository);
container.registerSingleton(SessionQuizResultPrismaRepository);
container.registerSingleton(SessionQuizPrismaRepository);
container.registerSingleton(SessionQuizSubjectPrismaRepository);
container.registerSingleton(SessionQuizStackPrismaRepository);
container.registerSingleton(GetQuizReportPrismaRepository);

container.register("IGeminiProvider", { useClass: GeminiProvider });

export const quizReportController = container.resolve(QuizReportController);
