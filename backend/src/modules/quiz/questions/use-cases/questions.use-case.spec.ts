import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizQuestionGenerateUseCase } from "./generate-questions";
import { QuizQuestion } from "@/entities/quiz-question.entity";
import type { IGetQuizQuestionContextOutputRepository } from "@/infra/database/prisma/quiz/questions/get-quiz-context.prisma.repository";
import type { IGenerateQuizQuestionByGeminiInputProvider } from "@/infra/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "../questions.dto";
import type { ICreateSessionWithQuizInput } from "@/infra/database/prisma/quiz/session/create-session-with-quiz.prisma.repository";

import type { QuizObjective } from "@/entities/quiz-objective.entity";
import type { QuizSubject } from "@/entities/quiz-subject.entity";
import type { Seniority } from "@/entities/seniority.entity";
import { Profile } from "@/entities/profile.entity";
import { Session } from "@/entities/session.entity";
import { SessionQuiz } from "@/entities/session-quiz.entity";
import type { Specialty } from "@/entities/specialty.entity";
import type { Stack } from "@/entities/stack.entity";
import type { Feature } from "@/entities/feature.entity";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const SESSION_QUIZ_ID = "session-quiz-uuid-123";
const FEATURE_ID = 1;

function makeContext(): IGetQuizQuestionContextOutputRepository {
  return {
    quizObjective: {
      id: 1,
      name: "Frontend Mastery",
      description: "Test frontend",
    } as unknown as QuizObjective,
    quizSubjects: [
      { id: 10, name: "CSS", description: "Styling" } as unknown as QuizSubject,
    ],
    seniority: { id: 2, name: "Senior" } as unknown as Seniority,
    specialty: { id: 3, name: "Frontend" } as unknown as Specialty,
    stacks: [{ id: 20, name: "React" } as unknown as Stack],
  };
}

function makeGeminiOutput() {
  return [
    {
      statement: "What is the box model?",
      alternatives: ["A", "B", "C", "D"],
      correctAlternativeIndex: 0,
      code: null,
      stackId: 20,
      subjectId: 10,
    },
    {
      statement: "Explain flexbox.",
      alternatives: ["W", "X", "Y", "Z"],
      correctAlternativeIndex: 2,
      code: "display: flex;",
      stackId: 20,
      subjectId: 10,
    },
    {
      statement: "What is CSS specificity?",
      alternatives: ["P", "Q", "R", "S"],
      correctAlternativeIndex: 3,
      code: null,
      stackId: 20,
      subjectId: 10,
    },
  ];
}

function makeSavedQuestions(): QuizQuestion[] {
  return makeGeminiOutput().map((q, i) =>
    QuizQuestion.create({
      id: i + 1,
      statement: q.statement,
      alternatives: q.alternatives,
      correctAlternativeIndex: q.correctAlternativeIndex,
      code: q.code,
      sessionQuizId: SESSION_QUIZ_ID,
      stackId: q.stackId,
      subjectId: q.subjectId,
      seniorityId: 2,
      specialtyId: 3,
      objectiveId: 1,
    }),
  );
}

function makeInput(quantity = 1): IQuizQuestionGenerateInputDTO {
  return {
    quizObjectiveId: 1,
    seniorityId: 2,
    specialtyId: 3,
    stacksId: [20],
    quizSubjectsId: [10],
    quantity,
    saveInProfile: false,
    userId: "user-123",
  };
}

// ─── Mocks factory ───────────────────────────────────────────────────────────

function makeUseCase() {
  const getQuizContextRepository = {
    execute: jest.fn<any>(),
  };
  const generateQuizQuestionQueue = {
    addJob: jest.fn<any>(),
    start: jest.fn<() => void>(),
  };
  const geminiProvider = {
    generateQuizQuestion: jest.fn<any>(),
  };
  const quizQuestionRepository = {
    create: jest.fn<any>(),
    createMany: jest.fn<any>(),
  };

  const updateProfileWithStacksRepository = {
    execute: jest.fn<any>(),
  };

  const createSessionWithQuizRepository = {
    execute: jest.fn<any>(),
  };

  const featureRepository = {
    findBySlug: jest
      .fn<any>()
      .mockResolvedValue({ id: FEATURE_ID } as unknown as Feature),
  };

  const quizQuestionEventEmitter = {
    emitNewQuestions: jest.fn(),
    emitFinished: jest.fn(),
  };

  const sessionQuizRepository = {
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  const useCase = new QuizQuestionGenerateUseCase(
    getQuizContextRepository as any,
    generateQuizQuestionQueue as any,
    geminiProvider as any,
    quizQuestionRepository as any,
    updateProfileWithStacksRepository as any,
    createSessionWithQuizRepository as any,
    featureRepository as any,
    sessionQuizRepository as any,
  );

  return {
    useCase,
    getQuizContextRepository,
    generateQuizQuestionQueue,
    geminiProvider,
    quizQuestionRepository,
    updateProfileWithStacksRepository,
    createSessionWithQuizRepository,
    featureRepository,
    quizQuestionEventEmitter,
    sessionQuizRepository,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("QuizQuestionGenerateUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Session creation ─────────────────────────────────────────────────────

  it("should call createSessionWithQuizRepository before generating questions", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    featureRepository.findBySlug.mockResolvedValue({
      id: FEATURE_ID,
    } as unknown as Feature);
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    const input = makeInput(1);
    await useCase.execute(input);

    const sessionCallOrder =
      createSessionWithQuizRepository.execute.mock.invocationCallOrder[0]!;
    const geminiCallOrder =
      geminiProvider.generateQuizQuestion.mock.invocationCallOrder[0]!;

    expect(sessionCallOrder).toBeLessThan(geminiCallOrder);
  });

  it("should call createSessionWithQuizRepository with correct data from the DTO", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    const input = makeInput(5);
    await useCase.execute(input);

    expect(createSessionWithQuizRepository.execute).toHaveBeenCalledTimes(1);
    expect(createSessionWithQuizRepository.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        session: expect.any(Object),
        sessionQuiz: expect.any(Object),
        stacksId: input.stacksId,
        quizSubjectsId: input.quizSubjectsId,
      }),
    );
  });

  it("should pass sessionQuizId to quizQuestionRepository.createMany", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(1));

    expect(quizQuestionRepository.createMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ sessionQuizId: SESSION_QUIZ_ID }),
      ]),
    );
  });

  it("should propagate errors thrown by createSessionWithQuizRepository", async () => {
    const { useCase, featureRepository, createSessionWithQuizRepository } =
      makeUseCase();

    createSessionWithQuizRepository.execute.mockRejectedValue(
      new Error("Session creation failed"),
    );

    await expect(useCase.execute(makeInput(1))).rejects.toThrow(
      "Session creation failed",
    );
  });

  // ── Existing behaviour ───────────────────────────────────────────────────

  it("should fetch context from repository with the given DTO", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    const input = makeInput(1);
    await useCase.execute(input);

    expect(getQuizContextRepository.execute).toHaveBeenCalledTimes(1);
    expect(getQuizContextRepository.execute).toHaveBeenCalledWith(input);
  });

  it("should pass the mapped gemini input to the Gemini provider", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(1));

    expect(geminiProvider.generateQuizQuestion).toHaveBeenCalledTimes(1);
    expect(geminiProvider.generateQuizQuestion).toHaveBeenCalledWith(
      expect.objectContaining({
        quizObjective: expect.objectContaining({
          id: 1,
          name: "Frontend Mastery",
        }),
        seniority: expect.objectContaining({ id: 2, name: "Senior" }),
        specialty: expect.objectContaining({ id: 3, name: "Frontend" }),
        stacks: [expect.objectContaining({ id: 20, name: "React" })],
        quizSubjects: [expect.objectContaining({ id: 10, name: "CSS" })],
        sessionQuiz: expect.objectContaining({ id: SESSION_QUIZ_ID }),
        quantityPerBatch: 1,
      }),
    );
  });

  it("should persist the generated questions using the repository", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    const output = makeGeminiOutput();
    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(output);
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(1));

    expect(quizQuestionRepository.createMany).toHaveBeenCalledTimes(1);
    expect(quizQuestionRepository.createMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          statement: output[0]?.statement,
          correctAlternativeIndex: output[0]?.correctAlternativeIndex,
          sessionQuizId: SESSION_QUIZ_ID,
        }),
      ]),
    );
  });

  it("should return the session quiz id", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    const saved = makeSavedQuestions();
    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(saved);

    const result = await useCase.execute(makeInput(1));

    expect(result).toEqual({ sessionQuizId: SESSION_QUIZ_ID });
  });

  it("should NOT enqueue any job when quantity is 1", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
      generateQuizQuestionQueue,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(1));

    expect(generateQuizQuestionQueue.addJob).not.toHaveBeenCalled();
  });

  it("should enqueue (quantity - 1) jobs for the remaining batches", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
      generateQuizQuestionQueue,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(25));

    // 1 is handled synchronously, 24 go to queue in 24 batches of 1
    expect(generateQuizQuestionQueue.addJob).toHaveBeenCalledTimes(24);
  });

  it("should enqueue jobs with the same mapped gemini input", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
      generateQuizQuestionQueue,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(15));

    const calls = generateQuizQuestionQueue.addJob.mock.calls;
    expect(calls).toHaveLength(14);

    for (const [jobData] of calls) {
      expect(jobData).toMatchObject({
        quizObjective: expect.objectContaining({ id: 1 }),
        seniority: expect.objectContaining({ id: 2 }),
        specialty: expect.objectContaining({ id: 3 }),
        sessionQuiz: expect.objectContaining({ id: SESSION_QUIZ_ID }),
      });
    }
  });

  it("should propagate errors thrown by the gemini provider", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockRejectedValue(
      new Error("Gemini API unavailable"),
    );

    await expect(useCase.execute(makeInput(1))).rejects.toThrow(
      "Gemini API unavailable",
    );
  });

  it("should propagate errors thrown by the context repository", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockRejectedValue(
      new Error("Context not found"),
    );

    await expect(useCase.execute(makeInput(1))).rejects.toThrow(
      "Context not found",
    );
  });

  it("should propagate errors thrown by createMany", async () => {
    const {
      useCase,
      featureRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockRejectedValue(new Error("DB error"));

    await expect(useCase.execute(makeInput(1))).rejects.toThrow("DB error");
  });

  // ── Edge cases ──────────────────────────────────────────────────────────

  it("should call updateProfileWithStacksRepository if saveInProfile is true", async () => {
    const {
      useCase,
      updateProfileWithStacksRepository,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
      featureRepository,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    const input = { ...makeInput(1), saveInProfile: true };
    await useCase.execute(input);

    expect(updateProfileWithStacksRepository.execute).toHaveBeenCalledTimes(1);
    expect(updateProfileWithStacksRepository.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: expect.any(Object),
        stacksId: input.stacksId,
      }),
    );
  });

  it("should throw error if quiz feature is not found", async () => {
    const { useCase, featureRepository } = makeUseCase();

    featureRepository.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute(makeInput(1))).rejects.toThrow(
      "Quiz feature not found in the database",
    );
  });

  it("should handle missing quizSubjectsId in input", async () => {
    const {
      useCase,
      createSessionWithQuizRepository,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    createSessionWithQuizRepository.execute.mockResolvedValue({
      sessionQuiz: { id: SESSION_QUIZ_ID, quantityQuestions: 1 } as any,
    });
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    const input = makeInput(1);
    delete input.quizSubjectsId;

    await useCase.execute(input);

    expect(createSessionWithQuizRepository.execute).toHaveBeenCalledWith(
      expect.not.objectContaining({ quizSubjectsId: expect.anything() }),
    );
  });
});
