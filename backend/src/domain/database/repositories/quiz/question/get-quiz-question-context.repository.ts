import type { IQuizQuestionGenerateByGeminiProvider } from "@/domain/providers/gemini.provider";
import type { IQuizGenerateQuestionsDTO } from "@/modules/quiz/questions/questions.dto";

export interface IGetQuizContextRepository {
  execute(
    data: IQuizGenerateQuestionsDTO,
  ): Promise<IQuizQuestionGenerateByGeminiProvider>;
}
