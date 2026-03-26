import { GoogleGenAI } from "@google/genai";
import { env } from "@/shared/env";
import { injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IQuizQuestionGenerateByGeminiInputProvider,
  IQuizQuestionGenerateByGeminiOutputProvider,
} from "@/domain/providers/gemini.provider";
import { InternalServerError } from "@/shared/app.error";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

@injectable()
export class GeminiProvider implements IGeminiProvider {
  async generateQuizQuestion(
    data: IQuizQuestionGenerateByGeminiInputProvider,
  ): Promise<IQuizQuestionGenerateByGeminiOutputProvider[]> {
    const prompt = `
Você é um especialista técnico em tecnologia da informação.
Gere TRÊS questão de múltipla escolha de nível técnico para uma plataforma de quiz de desenvolvimento de software.

Contexto da questão:
- Objetivo: ${data.quizObjective}
- Assunto(s): ${data.quizSubject.join(", ")}
- Nível de senioridade: ${data.seniority}
- Especialidade(s): ${data.specialty.join(", ")}
- Tecnologias/Stacks: ${data.stacks.length ? data.stacks.join(", ") : "qualquer tecnologia relevante"}

Retorne APENAS um ARRAY de JSON válido, sem markdown, sem explicações, seguindo EXATAMENTE este formato:
[
  {
    "statement": "enunciado da questão aqui",
    "alternatives": ["alternativa A", "alternativa B", "alternativa C", "alternativa D"],
    "correctAlternativeIndex": 0,
    "code": "trecho de código opcional, ou null"
  }
]

Regras:
- A questão deve ser desafiadora e relevante para o nível de senioridade informado.
- Sempre forneça exatamente 4 alternativas.
- "correctAlternativeIndex" deve ser o índice (0-3) da alternativa correta.
- "code" deve ser null se não houver código relevante.
`.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const raw = response.text?.trim();
    if (!raw)
      throw new InternalServerError("Failed to generate quiz questions");

    try {
      const parsed = JSON.parse(raw);

      return parsed.map((parsed: any) => ({
        statement: parsed.statement,
        alternatives: parsed.alternatives,
        correctAlternativeIndex: parsed.correctAlternativeIndex,
        code: parsed.code ?? null,
      }));
    } catch {
      throw new InternalServerError();
    }
  }
}
