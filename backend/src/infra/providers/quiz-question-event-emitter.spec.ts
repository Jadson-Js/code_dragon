import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizQuestionEventEmitter } from "./quiz-question-event-emitter";

describe("QuizQuestionEventEmitter", () => {
  let eventEmitter: QuizQuestionEventEmitter;

  beforeEach(() => {
    eventEmitter = new QuizQuestionEventEmitter();
  });

  it("should subscribe and emit new questions", () => {
    const sessionQuizId = "sess-1";
    const questions = [{ id: 1, statement: "Q1" }] as any[];
    const callback = jest.fn();

    eventEmitter.onNewQuestions(sessionQuizId, callback);
    eventEmitter.emitNewQuestions({ sessionQuizId, questions });

    expect(callback).toHaveBeenCalledWith(questions);
  });

  it("should unsubscribe from new questions", () => {
    const sessionQuizId = "sess-1";
    const questions = [{ id: 1, statement: "Q1" }] as any[];
    const callback = jest.fn();

    eventEmitter.onNewQuestions(sessionQuizId, callback);
    eventEmitter.offNewQuestions(sessionQuizId, callback);
    eventEmitter.emitNewQuestions({ sessionQuizId, questions });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should subscribe and emit finished event", () => {
    const sessionQuizId = "sess-1";
    const callback = jest.fn();

    eventEmitter.onFinished(sessionQuizId, callback);
    eventEmitter.emitFinished({ sessionQuizId });

    expect(callback).toHaveBeenCalledWith({ sessionQuizId });
  });

  it("should unsubscribe from finished event", () => {
    const sessionQuizId = "sess-1";
    const callback = jest.fn();

    eventEmitter.onFinished(sessionQuizId, callback);
    eventEmitter.offFinished(sessionQuizId, callback);
    eventEmitter.emitFinished({ sessionQuizId });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should only emit to the correct session quiz id", () => {
    const session1 = "sess-1";
    const session2 = "sess-2";
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    eventEmitter.onNewQuestions(session1, callback1);
    eventEmitter.onNewQuestions(session2, callback2);

    const questions = [{ id: 1 }] as any[];
    eventEmitter.emitNewQuestions({ sessionQuizId: session1, questions });

    expect(callback1).toHaveBeenCalledWith(questions);
    expect(callback2).not.toHaveBeenCalled();
  });
});
