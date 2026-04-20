import { describe, expect, it } from "@jest/globals";
import { SessionQuiz } from "./session-quiz.entity";
import { SessionQuizStatus } from "generated/prisma/enums";

describe("SessionQuiz Entity", () => {
  it("should create a session quiz with default values", () => {
    const sessionQuiz = SessionQuiz.create({
      sessionId: "session-1",
      userId: "user-1",
      seniorityId: 1,
      specialtyId: 2,
      quizObjectiveId: 3,
      quantityQuestions: 10,
    });

    expect(sessionQuiz.id).toBeDefined();
    expect(sessionQuiz.sessionId).toBe("session-1");
    expect(sessionQuiz.userId).toBe("user-1");
    expect(sessionQuiz.seniorityId).toBe(1);
    expect(sessionQuiz.specialtyId).toBe(2);
    expect(sessionQuiz.quizObjectiveId).toBe(3);
    expect(sessionQuiz.quantityQuestions).toBe(10);
    expect(sessionQuiz.score).toBe(0);
    expect(sessionQuiz.status).toBe(SessionQuizStatus.GENERATING);
    expect(sessionQuiz.createdAt).toBeInstanceOf(Date);
    expect(sessionQuiz.updatedAt).toBeInstanceOf(Date);
  });

  it("should update status", () => {
    const sessionQuiz = SessionQuiz.create({
      sessionId: "session-1",
      userId: "user-1",
      seniorityId: 1,
      specialtyId: 2,
      quizObjectiveId: 3,
      quantityQuestions: 10,
    });

    const oldUpdatedAt = sessionQuiz.updatedAt;

    sessionQuiz.updateStatus(SessionQuizStatus.FINISHED);

    expect(sessionQuiz.status).toBe(SessionQuizStatus.FINISHED);
    expect(sessionQuiz.updatedAt).not.toBe(oldUpdatedAt);
  });
});
