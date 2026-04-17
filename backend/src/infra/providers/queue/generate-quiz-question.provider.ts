import { BaseBullMQProvider } from "./base.bullmq.provider";
import { redisConnection } from "@/infra/database/redis/connection";
import type { Job } from "bullmq";
import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionInput,
} from "@/infra/providers/gemini.provider";
import { QuizQuestion } from "@/entities/quiz-question.entity";
import type { IQuizQuestionRepository } from "@/infra/database/prisma/quiz-question.prisma.repository";
import type { QuizQuestionEventEmitter } from "../quiz-question-event-emitter";
import type { ISessionQuizRepository } from "@/infra/database/prisma/session-quiz.prisma.repository";

@injectable()
export class GenerateQuizQuestionBullMQProvider extends BaseBullMQProvider<IGenerateQuizQuestionInput> {
  constructor(
    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,

    @inject("IQuizQuestionRepository")
    private readonly quizQuestionRepository: IQuizQuestionRepository,

    @inject("QuizQuestionEventEmitter")
    private readonly quizQuestionEventEmitter: QuizQuestionEventEmitter,

    @inject("ISessionQuizRepository")
    private readonly sessionQuizRepository: ISessionQuizRepository,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super("generateQuizQuestion", redisConnection as any);
  }

  async process(job: Job<IGenerateQuizQuestionInput>): Promise<void> {
    const sessionQuizId = job.data.sessionQuiz.id;
    const generateds = await this.geminiProvider.generateQuizQuestion(job.data);

    const questions = generateds.map((generated) => {
      return QuizQuestion.create({
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
      });
    });

    await this.quizQuestionRepository.createMany(questions);

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
