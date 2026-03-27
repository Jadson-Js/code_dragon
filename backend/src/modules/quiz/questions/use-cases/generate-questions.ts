import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IQuizQuestionGenerateByGeminiInputProvider,
} from "@/domain/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "../questions.dto";
import type { IGetQuizContextRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";
import type { GenerateQuizQuestionBullMQProvider } from "@/infra/providers/queue/generate-quiz-question.provider";
import type { BaseBullMQProvider } from "@/infra/providers/queue/base.bullmq.provider";
import type { IBaseQueueProvider } from "@/domain/providers/queue/base.provider";

@injectable()
export class QuizQuestionGenerateUseCase {
  constructor(
    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,

    @inject("IGetQuizContextRepository")
    private readonly getQuizContextRepository: IGetQuizContextRepository,

    @inject("IQuizQuestionRepository")
    private readonly quizQuestionRepository: IQuizQuestionRepository,

    @inject("IGenerateQuizQuestionQueue")
    private readonly generateQuizQuestionQueue: IBaseQueueProvider<IQuizQuestionGenerateByGeminiInputProvider>,
  ) {}

  async execute(data: IQuizQuestionGenerateInputDTO): Promise<void> {
    const context = await this.getQuizContextRepository.execute(data);

    await this.generateQuizQuestionQueue.addJob(context);
  }
}
