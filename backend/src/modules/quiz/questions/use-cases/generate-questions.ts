import { inject, injectable } from "tsyringe";
import type { IGeminiProvider } from "@/domain/providers/gemini.provider";

@injectable()
export class GenerateQuestionsUseCase {
  constructor(
    @inject("IGeminiProvider")
    private readonly geminiProvider: IGeminiProvider,
  ) {}

  async execute(): Promise<string> {
    const result = await this.geminiProvider.generateQuizQuestion();
    return result;
  }
}
