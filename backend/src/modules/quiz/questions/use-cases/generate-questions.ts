import { inject, injectable } from "tsyringe";
import type { IGeminiProvider } from "@/domain/providers/gemini.provider";
import type { IQuizGenerateQuestionsDTO } from "../questions.dto";
import type { IGetQuizContextRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizQuestionRepository } from "@/domain/database/repositories/quiz-question.repository";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";

@injectable()
export class QuizQuestionGenerateUseCase {
  constructor(
    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,

    @inject("IGetQuizContextRepository")
    private readonly getQuizContextRepository: IGetQuizContextRepository,

    @inject("IQuizQuestionRepository")
    private readonly quizQuestionRepository: IQuizQuestionRepository,
  ) {}

  async execute(data: IQuizGenerateQuestionsDTO): Promise<QuizQuestion> {
    const context = await this.getQuizContextRepository.execute(data);

    const generated = await this.geminiProvider.generateQuizQuestion(context);

    // Re-cria a entidade com os IDs reais do DTO
    const questionToSave = QuizQuestion.create({
      quizObjectiveId: data.quizObjectiveId,
      quizSubjectId: data.quizSubjectId?.[0] ?? 0,
      seniorityId: data.seniorityId,
      specialtyId: data.specialtyId,
      statement: generated.statement,
      alternatives: generated.alternatives,
      correctAlternativeIndex: generated.correctAlternativeIndex,
      code: generated.code,
    });

    return await this.quizQuestionRepository.create(questionToSave);
  }
}
