import { describe, expect, it } from "@jest/globals";
import { QuizQuestion } from "./quiz-question.entity";

describe("QuizQuestion entity", () => {
  describe("create", () => {
    it("should create a QuizQuestion with all provided props", () => {
      const now = new Date("2024-01-01");

      const q = QuizQuestion.create({
        id: 42,
        quizObjectiveId: 1,
        seniorityId: 2,
        specialtyId: 3,
        statement: "What is the box model?",
        alternatives: ["A", "B", "C", "D"],
        correctAlternativeIndex: 0,
        code: "display: flex;",
        reports: 5,
        createdAt: now,
        updatedAt: now,
      });

      expect(q.id).toBe(42);
      expect(q.quizObjectiveId).toBe(1);
      expect(q.seniorityId).toBe(2);
      expect(q.specialtyId).toBe(3);
      expect(q.statement).toBe("What is the box model?");
      expect(q.alternatives).toEqual(["A", "B", "C", "D"]);
      expect(q.correctAlternativeIndex).toBe(0);
      expect(q.code).toBe("display: flex;");
      expect(q.reports).toBe(5);
      expect(q.createdAt).toBe(now);
      expect(q.updatedAt).toBe(now);
    });

    it("should default id to undefined when not provided", () => {
      const q = QuizQuestion.create({
        quizObjectiveId: 1,
        seniorityId: 2,
        specialtyId: 3,
        statement: "What?",
        alternatives: ["X", "Y"],
        correctAlternativeIndex: 1,
      });

      expect(q.id).toBeUndefined();
    });

    it("should default code to null when not provided", () => {
      const q = QuizQuestion.create({
        quizObjectiveId: 1,
        seniorityId: 2,
        specialtyId: 3,
        statement: "What?",
        alternatives: ["X", "Y"],
        correctAlternativeIndex: 1,
      });

      expect(q.code).toBeNull();
    });

    it("should default reports to 0 when not provided", () => {
      const q = QuizQuestion.create({
        quizObjectiveId: 1,
        seniorityId: 2,
        specialtyId: 3,
        statement: "What?",
        alternatives: ["X", "Y"],
        correctAlternativeIndex: 1,
      });

      expect(q.reports).toBe(0);
    });

    it("should default createdAt and updatedAt to now when not provided", () => {
      const before = new Date();
      const q = QuizQuestion.create({
        quizObjectiveId: 1,
        seniorityId: 2,
        specialtyId: 3,
        statement: "What?",
        alternatives: ["X", "Y"],
        correctAlternativeIndex: 1,
      });
      const after = new Date();

      expect(q.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(q.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
