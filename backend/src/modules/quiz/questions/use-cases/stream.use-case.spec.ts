import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizQuestionStreamUseCase } from "./stream.use-case";
import { QuizQuestion } from "@/entities/quiz-question.entity";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const SESSION_QUIZ_ID = "session-quiz-uuid-123";

function makeSavedQuestions(): QuizQuestion[] {
  return [
    QuizQuestion.create({
      id: 1,
      statement: "Question 1",
      alternatives: ["A", "B", "C", "D"],
      correctAlternativeIndex: 0,
      code: null,
      sessionQuizId: SESSION_QUIZ_ID,
      stackId: 1,
      subjectId: 2,
      seniorityId: 3,
      specialtyId: 4,
      objectiveId: 5,
    }),
  ];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeResponse() {
  const handlers: Record<string, Function[]> = {};
  return {
    write: jest.fn(),
    end: jest.fn(),
    on: jest.fn((event: string, handler: Function) => {
      if (!handlers[event]) handlers[event] = [];
      handlers[event]!.push(handler);
    }),
    emit: (event: string, ...args: any[]) => {
      handlers[event]?.forEach((h) => h(...args));
    },
  };
}

function makeUseCase() {
  const quizQuestionRepository = {
    findBySessionQuizId: jest.fn<any>(),
  };
  const quizQuestionEventEmitter = {
    onNewQuestions: jest.fn(),
    offNewQuestions: jest.fn(),
    onFinished: jest.fn(),
    offFinished: jest.fn(),
  };
  const sessionQuizRepository = {
    findById: jest.fn<any>(),
  };

  const useCase = new QuizQuestionStreamUseCase(
    quizQuestionRepository as any,
    quizQuestionEventEmitter as any,
    sessionQuizRepository as any,
  );

  return {
    useCase,
    quizQuestionRepository,
    quizQuestionEventEmitter,
    sessionQuizRepository,
  };
}

// Helper to wait until all pending promises are resolved
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("QuizQuestionStreamUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should write existing questions to the response if they exist", async () => {
    const { useCase, quizQuestionRepository, sessionQuizRepository } =
      makeUseCase();
    const response = makeResponse();
    const questions = makeSavedQuestions();

    quizQuestionRepository.findBySessionQuizId.mockResolvedValue(questions);
    sessionQuizRepository.findById.mockResolvedValue({ status: "PENDING" });

    const executePromise = useCase.execute(
      { sessionQuizId: SESSION_QUIZ_ID },
      response as any,
    );

    await flushPromises();
    response.emit("close");
    await executePromise;

    expect(quizQuestionRepository.findBySessionQuizId).toHaveBeenCalledWith(
      SESSION_QUIZ_ID,
    );
    expect(response.write).toHaveBeenCalledWith(
      expect.stringContaining(JSON.stringify(questions)),
    );
  });

  it("should finish immediately if the session is already COMPLETED", async () => {
    const { useCase, quizQuestionRepository, sessionQuizRepository } =
      makeUseCase();
    const response = makeResponse();

    quizQuestionRepository.findBySessionQuizId.mockResolvedValue([]);
    sessionQuizRepository.findById.mockResolvedValue({ status: "COMPLETED" });

    await useCase.execute({ sessionQuizId: SESSION_QUIZ_ID }, response as any);

    expect(response.write).toHaveBeenCalledWith(
      expect.stringContaining("event: finished"),
    );
    expect(response.end).toHaveBeenCalled();
  });

  it("should subscribe to events if session is PENDING", async () => {
    const {
      useCase,
      quizQuestionRepository,
      sessionQuizRepository,
      quizQuestionEventEmitter,
    } = makeUseCase();
    const response = makeResponse();

    quizQuestionRepository.findBySessionQuizId.mockResolvedValue([]);
    sessionQuizRepository.findById.mockResolvedValue({ status: "PENDING" });

    const executePromise = useCase.execute(
      { sessionQuizId: SESSION_QUIZ_ID },
      response as any,
    );

    await flushPromises();

    expect(quizQuestionEventEmitter.onNewQuestions).toHaveBeenCalledWith(
      SESSION_QUIZ_ID,
      expect.any(Function),
    );
    expect(quizQuestionEventEmitter.onFinished).toHaveBeenCalledWith(
      SESSION_QUIZ_ID,
      expect.any(Function),
    );

    response.emit("close");
    await executePromise;
  });

  it("should write new questions when the event is emitted", async () => {
    const {
      useCase,
      quizQuestionRepository,
      sessionQuizRepository,
      quizQuestionEventEmitter,
    } = makeUseCase();
    const response = makeResponse();

    quizQuestionRepository.findBySessionQuizId.mockResolvedValue([]);
    sessionQuizRepository.findById.mockResolvedValue({ status: "PENDING" });

    const executePromise = useCase.execute(
      { sessionQuizId: SESSION_QUIZ_ID },
      response as any,
    );

    await flushPromises();

    const onNewQuestionsCallback = (
      quizQuestionEventEmitter.onNewQuestions as jest.Mock
    ).mock.calls[0]?.[1] as Function;
    const newQuestions = [makeSavedQuestions()[0]];

    onNewQuestionsCallback(newQuestions);

    expect(response.write).toHaveBeenCalledWith(
      expect.stringContaining(JSON.stringify(newQuestions)),
    );

    response.emit("close");
    await executePromise;
  });

  it("should end the response when the finished event is emitted", async () => {
    const {
      useCase,
      quizQuestionRepository,
      sessionQuizRepository,
      quizQuestionEventEmitter,
    } = makeUseCase();
    const response = makeResponse();

    quizQuestionRepository.findBySessionQuizId.mockResolvedValue([]);
    sessionQuizRepository.findById.mockResolvedValue({ status: "PENDING" });

    const executePromise = useCase.execute(
      { sessionQuizId: SESSION_QUIZ_ID },
      response as any,
    );

    await flushPromises();

    const onFinishedCallback = (
      quizQuestionEventEmitter.onFinished as jest.Mock
    ).mock.calls[0]?.[1] as Function;
    onFinishedCallback();

    expect(response.end).toHaveBeenCalled();

    response.emit("close");
    await executePromise;
  });

  it("should unsubscribe from events when the connection closes", async () => {
    const {
      useCase,
      quizQuestionRepository,
      sessionQuizRepository,
      quizQuestionEventEmitter,
    } = makeUseCase();
    const response = makeResponse();

    quizQuestionRepository.findBySessionQuizId.mockResolvedValue([]);
    sessionQuizRepository.findById.mockResolvedValue({ status: "PENDING" });

    const executePromise = useCase.execute(
      { sessionQuizId: SESSION_QUIZ_ID },
      response as any,
    );

    await flushPromises();
    response.emit("close");
    await executePromise;

    expect(quizQuestionEventEmitter.offNewQuestions).toHaveBeenCalledWith(
      SESSION_QUIZ_ID,
      expect.any(Function),
    );
    expect(quizQuestionEventEmitter.offFinished).toHaveBeenCalledWith(
      SESSION_QUIZ_ID,
      expect.any(Function),
    );
  });
});
