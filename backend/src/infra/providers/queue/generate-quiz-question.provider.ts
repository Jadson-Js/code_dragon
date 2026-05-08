import { BaseBullMQProvider } from "./base.bullmq.provider";
import { redisConnection } from "@/infra/database/redis/connection";
import type { Job } from "bullmq";
import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionInput,
} from "@/infra/providers/gemini.provider";
import { QuizQuestionEventEmitter } from "../quiz-question-event-emitter";
import { QuizQuestionPrismaRepository } from "@/infra/database/prisma/quiz-question.prisma.repository";
import { SessionQuizPrismaRepository } from "@/infra/database/prisma/session-quiz.prisma.repository";
import type { Prisma } from "generated/prisma/client";

@injectable()
export class GenerateQuizQuestionBullMQProvider extends BaseBullMQProvider<IGenerateQuizQuestionInput> {
  constructor(
    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,

    @inject(QuizQuestionPrismaRepository)
    private readonly quizQuestionRepository: QuizQuestionPrismaRepository,

    @inject(QuizQuestionEventEmitter)
    private readonly quizQuestionEventEmitter: QuizQuestionEventEmitter,

    @inject(SessionQuizPrismaRepository)
    private readonly sessionQuizRepository: SessionQuizPrismaRepository,
  ) {
    super("generateQuizQuestion", redisConnection as any);
  }

  async process(job: Job<IGenerateQuizQuestionInput>): Promise<void> {
    const sessionQuizId = job.data.sessionQuiz.id;
    const generateds = await this.geminiProvider.generateQuizQuestion(job.data);

    const questionsData: Prisma.QuizQuestionCreateManyInput[] = generateds.map(
      (generated) => ({
        statement: generated.statement,
        alternatives: generated.alternatives,
        correctAlternativeIndex: generated.correctAlternativeIndex,
        code: generated.code,
        sessionQuizId,
        stackId: generated.stackId,
        subjectId: generated.subjectId,
        seniorityId: job.data.seniority.id,
        specialtyId: job.data.specialty.id,
        objectiveId: job.data.quizObjective.id,
      }),
    );

    const questions =
      await this.quizQuestionRepository.createMany(questionsData);

    this.quizQuestionEventEmitter.emitNewQuestions({
      sessionQuizId,
      questions,
    });

    const count =
      await this.quizQuestionRepository.countBySessionQuizId(sessionQuizId);

    if (count >= job.data.sessionQuiz.quantityQuestions) {
      await this.sessionQuizRepository.updateStatus(
        sessionQuizId,
        "IN_PROGRESS",
      );
      this.quizQuestionEventEmitter.emitFinished({
        sessionQuizId,
      });
    }
  }
}
