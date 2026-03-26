import { GoogleGenAI } from "@google/genai";
import { env } from "@/shared/env";
import { injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IQuizQuestionGenerateByGeminiProvider,
} from "@/domain/providers/gemini.provider";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";
import { InternalServerError } from "@/shared/app.error";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

@injectable()
export class GeminiProvider implements IGeminiProvider {
  async generateQuizQuestion(
    data: IQuizQuestionGenerateByGeminiProvider,
  ): Promise<QuizQuestion> {
    const prompt = `
Você é um especialista técnico em tecnologia da informação.
Gere UMA questão de múltipla escolha de nível técnico para uma plataforma de quiz de desenvolvimento de software.

Contexto da questão:
- Objetivo: ${data.quizObjective}
- Assunto(s): ${data.quizSubject.join(", ")}
- Nível de senioridade: ${data.seniority}
- Especialidade(s): ${data.specialty.join(", ")}
- Tecnologias/Stacks: ${data.stacks.length ? data.stacks.join(", ") : "qualquer tecnologia relevante"}

Retorne APENAS um JSON válido, sem markdown, sem explicações, seguindo EXATAMENTE este formato:
{
  "statement": "enunciado da questão aqui",
  "alternatives": ["alternativa A", "alternativa B", "alternativa C", "alternativa D"],
  "correctAlternativeIndex": 0,
  "code": "trecho de código opcional, ou null"
}

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
    if (!raw) throw new InternalServerError();

    try {
      const parsed = JSON.parse(raw);

      return QuizQuestion.create({
        quizObjectiveId: 0, // será sobrescrito pelo use case com o ID real
        quizSubjectId: 0, // idem
        seniorityId: 0,
        specialtyId: 0,
        statement: parsed.statement,
        alternatives: JSON.stringify(parsed.alternatives),
        correctAlternativeIndex: parsed.correctAlternativeIndex,
        code: parsed.code ?? null,
      });
    } catch {
      throw new InternalServerError();
    }
  }
}
