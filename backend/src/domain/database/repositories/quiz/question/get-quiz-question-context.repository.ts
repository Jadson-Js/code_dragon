import type { IQuizQuestionGenerateByGeminiInputProvider } from "@/domain/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "@/modules/quiz/questions/questions.dto";

export interface IGetQuizContextRepository {
  execute(
    data: IQuizQuestionGenerateInputDTO,
  ): Promise<IQuizQuestionGenerateByGeminiInputProvider>;
}
