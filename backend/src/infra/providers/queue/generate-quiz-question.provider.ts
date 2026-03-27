import { BaseBullMQProvider } from "./base.bullmq.provider";
import { redisConnection } from "@/infra/database/redis/connection";
import type { Job } from "bullmq";
import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionByGeminiInputProvider,
} from "@/domain/providers/gemini.provider";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";

@injectable()
export class GenerateQuizQuestionBullMQProvider extends BaseBullMQProvider<IGenerateQuizQuestionByGeminiInputProvider> {
  constructor(
    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,

    @inject("IQuizQuestionRepository")
    private readonly quizQuestionRepository: IQuizQuestionRepository,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super("generateQuizQuestion", redisConnection as any);
  }

  async process(
    job: Job<IGenerateQuizQuestionByGeminiInputProvider>,
  ): Promise<void> {
    const generateds = await this.geminiProvider.generateQuizQuestion(job.data);

    const questions = generateds.map((generated) => {
      return QuizQuestion.create({
        quizObjectiveId: job.data.quizObjective.id,
        seniorityId: job.data.seniority.id,
        specialtyId: job.data.specialty.id,
        statement: generated.statement,
        alternatives: generated.alternatives,
        correctAlternativeIndex: generated.correctAlternativeIndex,
        code: generated.code,
      });
    });

    await this.quizQuestionRepository.createMany(questions);
  }
}
