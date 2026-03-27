import { inject, injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionByGeminiInputProvider,
} from "@/domain/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "../questions.dto";
import type { IGetQuizQuestionContextRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";
import type { IBaseQueueProvider } from "@/domain/providers/queue/base.provider";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";
import { mapContextToGeminiInput } from "../questions.mapper";

@injectable()
export class QuizQuestionGenerateUseCase {
  constructor(
    @inject("IGetQuizQuestionContextRepository")
    private readonly getQuizContextRepository: IGetQuizQuestionContextRepository,

    @inject("IGenerateQuizQuestionQueueProvider")
    private readonly generateQuizQuestionQueue: IBaseQueueProvider<IGenerateQuizQuestionByGeminiInputProvider>,

    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,

    @inject("IQuizQuestionRepository")
    private readonly quizQuestionRepository: IQuizQuestionRepository,
  ) {}

  async execute(data: IQuizQuestionGenerateInputDTO): Promise<QuizQuestion[]> {
    const context = await this.getQuizContextRepository.execute(data);
    const geminiInput = mapContextToGeminiInput(context);

    // Primeiro lote: síncrono — o frontend recebe as primeiras questões na hora
    const generateds =
      await this.geminiProvider.generateQuizQuestion(geminiInput);

    const questions = generateds.map((generated) =>
      QuizQuestion.create({
        quizObjectiveId: geminiInput.quizObjective.id,
        seniorityId: geminiInput.seniority.id,
        specialtyId: geminiInput.specialty.id,
        statement: generated.statement,
        alternatives: generated.alternatives,
        correctAlternativeIndex: generated.correctAlternativeIndex,
        code: generated.code,
      }),
    );

    const savedQuestions =
      await this.quizQuestionRepository.createMany(questions);

    for (let i = 1; i < data.quantity; i++) {
      await this.generateQuizQuestionQueue.addJob(geminiInput);
    }

    return savedQuestions;
  }
}
