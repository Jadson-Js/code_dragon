import { GoogleGenAI } from "@google/genai";
import { env } from "@/shared/env";
import { injectable } from "tsyringe";
import type { IGeminiProvider } from "@/domain/providers/gemini.provider";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

@injectable()
export class GeminiProvider implements IGeminiProvider {
  async generateQuizQuestion() {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: "Say: Hello World!",
    });

    return response.text || "";
  }
}
