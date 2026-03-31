import { GoogleGenAI } from "@google/genai";
import { env } from "@/shared/env";
import { injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionByGeminiInputProvider,
  IGenerateQuizQuestionByGeminiOutputProvider,
} from "@/domain/providers/gemini.provider";
import { InternalServerError } from "@/shared/app.error";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

@injectable()
export class GeminiProvider implements IGeminiProvider {
  async generateQuizQuestion(
    data: IGenerateQuizQuestionByGeminiInputProvider,
  ): Promise<IGenerateQuizQuestionByGeminiOutputProvider[]> {
    const prompt = `
Você é um Tech Lead Sênior e especialista em criação de avaliações técnicas avançadas para desenvolvedores de software.
Sua missão é gerar exatamente 5 (cinco) questões de múltipla escolha, rigorosas e precisas.

=== CONTEXTO DA AVALIAÇÃO ===
- Objetivo: ${data.quizObjective.name} (${data.quizObjective.description})
- Assunto(s): ${data.quizSubject?.map((s) => `${s.name} - ${s.description}`).join(" | ") ?? "Nenhum assunto específico"}
- Nível de senioridade: ${data.seniority.name}
- Especialidade(s): ${data.specialty.name}
- Tecnologias/Stacks: ${data.stacks.map((s) => s.name).join(", ")}

=== REGRAS DE QUALIDADE DAS QUESTÕES ===
1. Adequação ao Nível: As questões DEVEM refletir exatamente o nível de senioridade (${data.seniority.name}).
   - Se Júnior: Foco em fundamentos, sintaxe e ciclo de vida.
   - Se Pleno/Sênior: Foco em cenários reais, arquitetura, trade-offs, performance e edge-cases (evite perguntas de "o que é X?").
2. Distratores Plausíveis: As 3 alternativas incorretas devem ser erros comuns, pegadinhas lógicas ou ferramentas similares que confundam quem não tem domínio prático do assunto. Não crie alternativas obviamente falsas.
3. Randomização: Varie a posição da alternativa correta. O 'correctAlternativeIndex' deve ter uma distribuição imprevisível entre 0, 1, 2 e 3.
4. Código: Se a questão envolver leitura de código, coloque-o em "code". O código deve ser limpo e estar devidamente escapado para JSON (use \\n para quebras de linha).

=== FORMATO DE SAÍDA EXIGIDO ===
Retorne a resposta EXCLUSIVAMENTE em um ARRAY de objetos JSON.
NÃO inclua blocos de formatação markdown (como \`\`\`json ou \`\`\`).
NÃO adicione nenhum texto antes ou depois do array.

Exemplo da estrutura exata esperada:
[
  {
    "statement": "Enunciado claro e direto descrevendo o cenário ou problema tecnológico.",
    "alternatives": [
      "Distrator plausível baseado em um erro comum de conceito.",
      "A resposta correta e tecnicamente precisa.",
      "Distrator que mistura dois conceitos parecidos.",
      "Distrator que faz sentido apenas em uma versão antiga da tecnologia."
    ],
    "correctAlternativeIndex": 1,
    "code": "function example() {\\n  return true;\\n}" // ou null se não houver código
  }
]
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

      return (parsed as IGenerateQuizQuestionByGeminiOutputProvider[]).map(
        (p) => ({
          statement: p.statement,
          alternatives: p.alternatives,
          correctAlternativeIndex: p.correctAlternativeIndex,
          code: p.code ?? null,
        }),
      );
    } catch {
      throw new InternalServerError();
    }
  }
}
