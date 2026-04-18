import { describe, expect, it } from "@jest/globals";
import { mapContextToGeminiInput } from "./questions.mapper";
import type { IGetQuizQuestionContextOutput } from "@/infra/database/prisma/quiz/questions/get-quiz-context.prisma.repository";
import type { SessionQuiz } from "@/entities/session-quiz.entity";

function makeContext(
  overrides: Partial<IGetQuizQuestionContextOutput> = {},
): IGetQuizQuestionContextOutput {
  return {
    quizObjective: {
      id: 1,
      name: "Frontend Mastery",
      description: "Test frontend skills",
      slug: "frontend-mastery",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    quizSubjects: [
      {
        id: 10,
        name: "CSS",
        description: "Styles and layouts",
        slug: "css",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        name: "HTML",
        description: "Markup language",
        slug: "html",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    seniority: {
      id: 2,
      name: "Senior",
      slug: "senior",
      description: "Senior level",
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    specialty: {
      id: 3,
      name: "Frontend",
      slug: "frontend",
      description: "Frontend specialty",
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    stacks: [
      {
        id: 20,
        name: "React",
        slug: "react",
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 21,
        name: "TypeScript",
        slug: "typescript",
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    ...overrides,
  } as IGetQuizQuestionContextOutput;
}

const mockSessionQuiz = { id: "session-quiz-id" } as SessionQuiz;

describe("mapContextToGeminiInput", () => {
  it("should map quizObjective fields correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1, mockSessionQuiz);

    expect(result.quizObjective).toEqual({
      id: 1,
      name: "Frontend Mastery",
      description: "Test frontend skills",
    });
  });

  it("should map quizSubject array correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1, mockSessionQuiz);

    expect(result.quizSubjects).toEqual([
      { id: 10, name: "CSS", description: "Styles and layouts" },
      { id: 11, name: "HTML", description: "Markup language" },
    ]);
  });

  it("should map seniority correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1, mockSessionQuiz);

    expect(result.seniority).toEqual({ id: 2, name: "Senior" });
  });

  it("should map specialty correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1, mockSessionQuiz);

    expect(result.specialty).toEqual({ id: 3, name: "Frontend" });
  });

  it("should map stacks array correctly", () => {
    const result = mapContextToGeminiInput(makeContext(), 1, mockSessionQuiz);

    expect(result.stacks).toEqual([
      { id: 20, name: "React" },
      { id: 21, name: "TypeScript" },
    ]);
  });

  it("should handle empty quizSubject array", () => {
    const result = mapContextToGeminiInput(
      makeContext({ quizSubjects: [] }),
      1,
      mockSessionQuiz,
    );

    expect(result.quizSubjects).toEqual([]);
  });

  it("should handle empty stacks array", () => {
    const result = mapContextToGeminiInput(makeContext({ stacks: [] }), 1, mockSessionQuiz);

    expect(result.stacks).toEqual([]);
  });

  it("should cast id fields to number", () => {
    const context = makeContext();
    // Simulate Prisma returning ids as undefined (e.g. optional fields)
    (context.quizObjective as unknown as { id: number }).id = 99;
    (context.seniority as unknown as { id: number }).id = 88;
    (context.specialty as unknown as { id: number }).id = 77;

    const result = mapContextToGeminiInput(context, 1, mockSessionQuiz);

    expect(result.quizObjective.id).toBe(99);
    expect(result.seniority.id).toBe(88);
    expect(result.specialty.id).toBe(77);
  });
});
