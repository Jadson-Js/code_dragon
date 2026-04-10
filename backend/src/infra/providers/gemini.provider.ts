import { GoogleGenAI } from "@google/genai";
import { env } from "@/shared/env";
import { injectable } from "tsyringe";
import type {
  IGeminiProvider,
  IGenerateQuizQuestionByGeminiInputProvider,
  IGenerateQuizQuestionByGeminiOutputProvider,
} from "@/domain/providers/gemini.provider";
import { InternalServerError, TooManyRequestsError } from "@/shared/app.error";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

@injectable()
export class GeminiProvider implements IGeminiProvider {
  private async withRetry<T>(
    fn: () => Promise<T>,
    retries = 5,
    delay = 2000,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      const isRetryable =
        error?.status === 429 ||
        error?.status === 503 ||
        error?.message?.includes("429") ||
        error?.message?.includes("503") ||
        error?.message?.includes("RESOURCE_EXHAUSTED") ||
        error?.message?.includes("UNAVAILABLE");

      if (isRetryable && retries > 0) {
        console.warn(
          `⚠️ Gemini API error detected (${error?.status || "unknown"}). Retrying in ${delay}ms... (${retries} attempts left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.withRetry(fn, retries - 1, delay * 2);
      }

      if (isRetryable) {
        throw new TooManyRequestsError(
          "Gemini API is currently busy or rate limited. Please try again later.",
        );
      }

      throw error;
    }
  }

  async generateQuizQuestion(
    data: IGenerateQuizQuestionByGeminiInputProvider,
  ): Promise<IGenerateQuizQuestionByGeminiOutputProvider[]> {
    const stacksList = data.stacks
      .map((s) => `  - id: ${s.id}, nome: "${s.name}"`)
      .join("\n");

    const hasSubjects = data.quizSubjects && data.quizSubjects.length > 0;

    const subjectsList = hasSubjects
      ? data
          .quizSubjects!.map(
            (s) =>
              `  - id: ${s.id}, nome: "${s.name}", descrição: "${s.description}"`,
          )
          .join("\n")
      : "Nenhum assunto específico";

    const validSubjectIds = hasSubjects
      ? data.quizSubjects!.map((s) => s.id)
      : [];

    const prompt = `
Você é um Tech Lead Sênior e especialista em criação de avaliações técnicas avançadas para desenvolvedores de software.
Sua missão é gerar exatamente ${data.quantityPerBatch} questões de múltipla escolha, rigorosa e precisa.

=== CONTEXTO DA AVALIAÇÃO ===
- Objetivo: ${data.quizObjective.name} (${data.quizObjective.description})
- Nível de senioridade: ${data.seniority.name}
- Especialidade: ${data.specialty.name}

=== STACKS DISPONÍVEIS ===
O payload contém as seguintes stacks (tecnologias):
${stacksList}

IMPORTANTE: Cada questão deve ser sobre APENAS UMA stack. Você deve escolher a stack mais adequada para a questão gerada.
Você deve retornar o "stackId" (inteiro) correspondente à stack selecionada. Use EXCLUSIVAMENTE um dos IDs listados acima. Caso a questão não se aplique a nenhuma stack específica, retorne null.

=== ASSUNTOS DISPONÍVEIS ===
${subjectsList}

IMPORTANTE: Cada questão deve ser sobre APENAS UM assunto. Você deve escolher o assunto mais adequado para a questão gerada.
Você deve retornar o "subjectId" (inteiro) correspondente ao assunto selecionado.
Os ÚNICOS valores válidos para "subjectId" são: [${validSubjectIds.join(", ")}].
Caso a questão não se aplique a nenhum assunto específico da lista, ou se a lista estiver vazia, retorne null.

=== REGRAS DE QUALIDADE DAS QUESTÕES ===
1. Adequação ao Nível: As questões DEVEM refletir exatamente o nível de senioridade (${data.seniority.name}).
   - Se Júnior: Foco em fundamentos, sintaxe e ciclo de vida.
   - Se Pleno/Sênior: Foco em cenários reais, arquitetura, trade-offs, performance e edge-cases (evite perguntas de "o que é X?").
2. Distratores Plausíveis: As 3 alternativas incorretas devem ser erros comuns, pegadinhas lógicas ou ferramentas similares que confundam quem não tem domínio prático do assunto. Não crie alternativas obviamente falsas.
3. Randomização: Varie a posição da alternativa correta. O 'correctAlternativeIndex' deve ter uma distribuição imprevisível entre 0, 1, 2 e 3.
4. Código: Se a questão envolver leitura de código, coloque-o em "code". O código deve ser limpo e estar devidamente escapado para JSON (use \\\\n para quebras de linha).
5. Uma stack por questão: A questão gerada pode ser sobre APENAS UMA das stacks fornecidas. Você decide qual é a mais relevante para o contexto do assunto e objetivo.

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
    "code": "function example() {\\\\n  return true;\\\\n}" ,
    "stackId": 3,
    "subjectId": 7
  }
]

LEMBRE-SE:
- "stackId" DEVE ser um dos seguintes IDs: [${data.stacks.map((s) => s.id).join(", ")}] ou null
- "subjectId" DEVE ser um dos seguintes IDs: [${validSubjectIds.join(", ")}] ou null
- NÃO invente IDs. Use SOMENTE os IDs fornecidos acima ou null.`.trim();

    const response = await this.withRetry(() =>
      ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      }),
    );

    const raw = response.text?.trim();
    if (!raw)
      throw new InternalServerError("Failed to generate quiz questions");

    try {
      const parsed = JSON.parse(raw);

      const validStackIds = new Set(data.stacks.map((s) => s.id));
      const validSubjectIdsSet = new Set(validSubjectIds);

      return (parsed as IGenerateQuizQuestionByGeminiOutputProvider[]).map(
        (p) => {
          const stackId =
            p.stackId && validStackIds.has(p.stackId) ? p.stackId : null;
          const subjectId =
            p.subjectId && validSubjectIdsSet.has(p.subjectId)
              ? p.subjectId
              : null;

          return {
            statement: p.statement,
            alternatives: p.alternatives,
            correctAlternativeIndex: p.correctAlternativeIndex,
            code: p.code ?? null,
            stackId,
            subjectId,
          };
        },
      );
    } catch {
      throw new InternalServerError();
    }
  }
}
