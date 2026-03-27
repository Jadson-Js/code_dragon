import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizQuestionGenerateUseCase } from "./generate-questions";
import { QuizQuestion } from "@/domain/entities/quiz-question.entity";
import type { IGetQuizQuestionContextOutputRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IGenerateQuizQuestionByGeminiInputProvider } from "@/domain/providers/gemini.provider";
import type { IQuizQuestionGenerateInputDTO } from "../questions.dto";

import type { QuizObjective } from "@/domain/entities/quiz-objective.entity";
import type { QuizSubject } from "@/domain/entities/quiz-subject.entity";
import type { Seniority } from "@/domain/entities/seniority.entity";
import type { Specialty } from "@/domain/entities/specialty.entity";
import type { Stack } from "@/domain/entities/stack.entity";

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makeContext(): IGetQuizQuestionContextOutputRepository {
  return {
    quizObjective: {
      id: 1,
      name: "Frontend Mastery",
      description: "Test frontend",
    } as unknown as QuizObjective,
    quizSubject: [
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
    },
    {
      statement: "Explain flexbox.",
      alternatives: ["W", "X", "Y", "Z"],
      correctAlternativeIndex: 2,
      code: "display: flex;",
    },
    {
      statement: "What is CSS specificity?",
      alternatives: ["P", "Q", "R", "S"],
      correctAlternativeIndex: 3,
      code: null,
    },
  ];
}

function makeSavedQuestions(): QuizQuestion[] {
  return makeGeminiOutput().map((q, i) =>
    QuizQuestion.create({
      id: i + 1,
      quizObjectiveId: 1,
      seniorityId: 2,
      specialtyId: 3,
      statement: q.statement,
      alternatives: q.alternatives,
      correctAlternativeIndex: q.correctAlternativeIndex,
      code: q.code,
    }),
  );
}

function makeInput(quantity = 1): IQuizQuestionGenerateInputDTO {
  return {
    quizObjectiveId: 1,
    seniorityId: 2,
    specialtyId: 3,
    stacksId: [20],
    quantity,
    saveInProfile: false,
  };
}

// ─── Mocks factory ───────────────────────────────────────────────────────────

function makeUseCase() {
  const getQuizContextRepository = {
    execute:
      jest.fn<
        (
          data: IQuizQuestionGenerateInputDTO,
        ) => Promise<IGetQuizQuestionContextOutputRepository>
      >(),
  };
  const generateQuizQuestionQueue = {
    addJob:
      jest.fn<
        (data: IGenerateQuizQuestionByGeminiInputProvider) => Promise<void>
      >(),
    start: jest.fn<() => void>(),
  };
  const geminiProvider = {
    generateQuizQuestion:
      jest.fn<
        (
          data: IGenerateQuizQuestionByGeminiInputProvider,
        ) => Promise<ReturnType<typeof makeGeminiOutput>>
      >(),
  };
  const quizQuestionRepository = {
    create: jest.fn<(data: QuizQuestion) => Promise<QuizQuestion>>(),
    createMany: jest.fn<(data: QuizQuestion[]) => Promise<QuizQuestion[]>>(),
  };

  const useCase = new QuizQuestionGenerateUseCase(
    getQuizContextRepository as never,
    generateQuizQuestionQueue as never,
    geminiProvider as never,
    quizQuestionRepository as never,
  );

  return {
    useCase,
    getQuizContextRepository,
    generateQuizQuestionQueue,
    geminiProvider,
    quizQuestionRepository,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("QuizQuestionGenerateUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch context from repository with the given DTO", async () => {
    const {
      useCase,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

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
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

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
        quizSubject: [expect.objectContaining({ id: 10, name: "CSS" })],
      }),
    );
  });

  it("should persist the generated questions using the repository", async () => {
    const {
      useCase,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    const output = makeGeminiOutput();
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(output);
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(1));

    expect(quizQuestionRepository.createMany).toHaveBeenCalledTimes(1);
    expect(quizQuestionRepository.createMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          quizObjectiveId: 1,
          seniorityId: 2,
          specialtyId: 3,
          statement: output[0]?.statement,
          correctAlternativeIndex: output[0]?.correctAlternativeIndex,
        }),
      ]),
    );
  });

  it("should return the saved questions from the repository", async () => {
    const {
      useCase,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    const saved = makeSavedQuestions();
    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(saved);

    const result = await useCase.execute(makeInput(1));

    expect(result).toBe(saved);
  });

  it("should NOT enqueue any job when quantity is 1", async () => {
    const {
      useCase,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
      generateQuizQuestionQueue,
    } = makeUseCase();

    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(1));

    expect(generateQuizQuestionQueue.addJob).not.toHaveBeenCalled();
  });

  it("should enqueue (quantity - 1) jobs for the remaining batches", async () => {
    const {
      useCase,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
      generateQuizQuestionQueue,
    } = makeUseCase();

    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(5));

    // 1 is handled synchronously, so 4 jobs go to the queue
    expect(generateQuizQuestionQueue.addJob).toHaveBeenCalledTimes(4);
  });

  it("should enqueue jobs with the same mapped gemini input", async () => {
    const {
      useCase,
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
      generateQuizQuestionQueue,
    } = makeUseCase();

    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockResolvedValue(makeSavedQuestions());

    await useCase.execute(makeInput(3));

    const calls = generateQuizQuestionQueue.addJob.mock.calls;
    expect(calls).toHaveLength(2);

    for (const [jobData] of calls) {
      expect(jobData).toMatchObject({
        quizObjective: expect.objectContaining({ id: 1 }),
        seniority: expect.objectContaining({ id: 2 }),
        specialty: expect.objectContaining({ id: 3 }),
      });
    }
  });

  it("should propagate errors thrown by the gemini provider", async () => {
    const { useCase, getQuizContextRepository, geminiProvider } = makeUseCase();

    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockRejectedValue(
      new Error("Gemini API unavailable"),
    );

    await expect(useCase.execute(makeInput(1))).rejects.toThrow(
      "Gemini API unavailable",
    );
  });

  it("should propagate errors thrown by the context repository", async () => {
    const { useCase, getQuizContextRepository } = makeUseCase();

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
      getQuizContextRepository,
      geminiProvider,
      quizQuestionRepository,
    } = makeUseCase();

    getQuizContextRepository.execute.mockResolvedValue(makeContext());
    geminiProvider.generateQuizQuestion.mockResolvedValue(makeGeminiOutput());
    quizQuestionRepository.createMany.mockRejectedValue(new Error("DB error"));

    await expect(useCase.execute(makeInput(1))).rejects.toThrow("DB error");
  });
});
