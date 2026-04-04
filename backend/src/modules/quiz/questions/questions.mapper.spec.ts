import { describe, expect, it } from "@jest/globals";
import { mapContextToGeminiInput } from "./questions.mapper";
import type { IGetQuizQuestionContextOutputRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { QuizObjective } from "@/domain/entities/quiz-objective.entity";
import type { QuizSubject } from "@/domain/entities/quiz-subject.entity";
import type { Seniority } from "@/domain/entities/seniority.entity";
import type { Specialty } from "@/domain/entities/specialty.entity";
import type { Stack } from "@/domain/entities/stack.entity";

function makeContext(
  overrides: Partial<IGetQuizQuestionContextOutputRepository> = {},
): IGetQuizQuestionContextOutputRepository {
  return {
    quizObjective: {
      id: 1,
      name: "Frontend Mastery",
      description: "Test frontend skills",
    } as unknown as QuizObjective,
    quizSubjects: [
      {
        id: 10,
        name: "CSS",
        description: "Styles and layouts",
      } as unknown as QuizSubject,
      {
        id: 11,
        name: "HTML",
        description: "Markup language",
      } as unknown as QuizSubject,
    ],
    seniority: { id: 2, name: "Senior" } as unknown as Seniority,
    specialty: { id: 3, name: "Frontend" } as unknown as Specialty,
    stacks: [
      { id: 20, name: "React" } as unknown as Stack,
      { id: 21, name: "TypeScript" } as unknown as Stack,
    ],
    ...overrides,
  };
}

describe("mapContextToGeminiInput", () => {
  it("should map quizObjective fields correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1);

    expect(result.quizObjective).toEqual({
      id: 1,
      name: "Frontend Mastery",
      description: "Test frontend skills",
    });
  });

  it("should map quizSubject array correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1);

    expect(result.quizSubjects).toEqual([
      { id: 10, name: "CSS", description: "Styles and layouts" },
      { id: 11, name: "HTML", description: "Markup language" },
    ]);
  });

  it("should map seniority correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1);

    expect(result.seniority).toEqual({ id: 2, name: "Senior" });
  });

  it("should map specialty correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1);

    expect(result.specialty).toEqual({ id: 3, name: "Frontend" });
  });

  it("should map stacks array correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1);

    expect(result.stacks).toEqual([
      { id: 20, name: "React" },
      { id: 21, name: "TypeScript" },
    ]);
  });

  it("should handle empty quizSubject array", () => {
    const result = mapContextToGeminiInput(
      makeContext({ quizSubjects: [] }),
      1,
    );

    expect(result.quizSubjects).toEqual([]);
  });

  it("should handle empty stacks array", () => {
    const result = mapContextToGeminiInput(makeContext({ stacks: [] }), 1);

    expect(result.stacks).toEqual([]);
  });

  it("should cast id fields to number", () => {
    const context = makeContext();
    // Simulate Prisma returning ids as undefined (e.g. optional fields)
    (context.quizObjective as unknown as { id: number }).id = 99;
    (context.seniority as unknown as { id: number }).id = 88;
    (context.specialty as unknown as { id: number }).id = 77;

    const result = mapContextToGeminiInput(context, 1);

    expect(result.quizObjective.id).toBe(99);
    expect(result.seniority.id).toBe(88);
    expect(result.specialty.id).toBe(77);
  });
});
