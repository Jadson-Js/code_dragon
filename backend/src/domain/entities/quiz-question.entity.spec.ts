import { describe, expect, it } from "@jest/globals";
import { QuizQuestion } from "./quiz-question.entity";

const baseProps = {
  statement: "What?",
  alternatives: ["X", "Y"],
  correctAlternativeIndex: 1,
  sessionQuizId: "session-123",
  stackId: 1,
  subjectId: 2,
  seniorityId: 3,
  specialtyId: 4,
  objectiveId: 5,
};

describe("QuizQuestion entity", () => {
  describe("create", () => {
    it("should create a QuizQuestion with all provided props", () => {
      const now = new Date("2024-01-01");

      const q = QuizQuestion.create({
        id: 42,
        statement: "What is the box model?",
        alternatives: ["A", "B", "C", "D"],
        correctAlternativeIndex: 0,
        code: "display: flex;",
        reports: 5,
        sessionQuizId: "session-123",
        stackId: 1,
        subjectId: 2,
        seniorityId: 3,
        specialtyId: 4,
        objectiveId: 5,
        createdAt: now,
        updatedAt: now,
      });

      expect(q.id).toBe(42);
      expect(q.statement).toBe("What is the box model?");
      expect(q.alternatives).toEqual(["A", "B", "C", "D"]);
      expect(q.correctAlternativeIndex).toBe(0);
      expect(q.code).toBe("display: flex;");
      expect(q.reports).toBe(5);
      expect(q.sessionQuizId).toBe("session-123");
      expect(q.stackId).toBe(1);
      expect(q.subjectId).toBe(2);
      expect(q.seniorityId).toBe(3);
      expect(q.specialtyId).toBe(4);
      expect(q.objectiveId).toBe(5);
      expect(q.createdAt).toBe(now);
      expect(q.updatedAt).toBe(now);
    });

    it("should default id to undefined when not provided", () => {
      const q = QuizQuestion.create(baseProps);

      expect(q.id).toBeUndefined();
    });

    it("should default code to null when not provided", () => {
      const q = QuizQuestion.create(baseProps);

      expect(q.code).toBeNull();
    });

    it("should default reports to 0 when not provided", () => {
      const q = QuizQuestion.create(baseProps);

      expect(q.reports).toBe(0);
    });

    it("should default createdAt and updatedAt to now when not provided", () => {
      const before = new Date();
      const q = QuizQuestion.create(baseProps);
      const after = new Date();

      expect(q.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(q.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
