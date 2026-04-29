import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { QuizReportSubmitUseCase } from "./submit.use-case";
import * as utils from "@/shared/utils";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/shared/app.error";
import { SessionQuizStatus } from "generated/prisma/enums";

// Mock utilities
jest.mock("@/shared/utils", () => ({
  calculatePercentage: jest.fn<any>((correct: number, total: number) =>
    total === 0 ? 0 : Math.round((correct / total) * 100),
  ),
}));

describe("QuizReportSubmitUseCase", () => {
  let useCase: QuizReportSubmitUseCase;

  const mockQuizQuestionRepository = {
    findManyByIds: jest.fn<any>(),
  };
  const mockSessionQuizResultRepository = {
    findManyScoreBySeniority: jest.fn<any>(),
  };
  const mockSessionQuizRepository = {
    findById: jest.fn<any>(),
  };
  const mockSessionQuizSubjectRepository = {
    findAverageScoreByContext: jest.fn<any>(),
  };
  const mockSessionQuizStackRepository = {
    findAverageScoreByContext: jest.fn<any>(),
  };
  const mockQuizReportSaveSubmitPrismaRepository = {
    execute: jest.fn<any>(),
  };
  const mockGeminiProvider = {
    generateQuizInsights: jest.fn<any>(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new QuizReportSubmitUseCase(
      mockQuizQuestionRepository as any,
      mockSessionQuizResultRepository as any,
      mockSessionQuizRepository as any,
      mockSessionQuizSubjectRepository as any,
      mockSessionQuizStackRepository as any,
      mockQuizReportSaveSubmitPrismaRepository as any,
      mockGeminiProvider as any,
    );
  });

  const mockQuestions = [
    {
      id: "q1-uuid",
      statement: "Q1",
      subjectId: 10,
      subject: { name: "Subject 1" },
      stackId: 20,
      stack: { name: "Stack 1" },
    },
    {
      id: "q2-uuid",
      statement: "Q2",
      subjectId: 10,
      subject: { name: "Subject 1" },
      stackId: 21,
      stack: { name: "Stack 2" },
    },
  ];

  const SESSION_QUIZ_ID = "11111111-1111-4111-8111-111111111111";

  const mockSession = {
    id: SESSION_QUIZ_ID,
    userId: "user-123",
    seniorityId: 1,
    quantityQuestions: 2,
    status: SessionQuizStatus.IN_PROGRESS,
  };

  it("should successfully process quiz submission", async () => {
    const input: any = {
      userId: "user-123",
      sessionQuizId: SESSION_QUIZ_ID,
      answers: [
        { quizQuestionId: "q1-uuid", selectedCorrectOption: true },
        { quizQuestionId: "q2-uuid", selectedCorrectOption: false },
      ],
    };

    mockQuizQuestionRepository.findManyByIds.mockResolvedValue(mockQuestions);
    mockSessionQuizRepository.findById.mockResolvedValue(mockSession);
    mockSessionQuizResultRepository.findManyScoreBySeniority.mockResolvedValue([
      60, 70,
    ]);
    mockSessionQuizSubjectRepository.findAverageScoreByContext.mockResolvedValue(
      [{ subjectId: 10, averageScore: 65 }],
    );
    mockSessionQuizStackRepository.findAverageScoreByContext.mockResolvedValue([
      { stackId: 20, averageScore: 60 },
      { stackId: 21, averageScore: 70 },
    ]);

    mockGeminiProvider.generateQuizInsights.mockResolvedValue({
      insights: {
        title: "Test Insights",
        description: "Test Description",
        strongPoints: ["Point 1"],
        weakPoints: ["Point 2"],
      },
      roadmap: [
        {
          title: "Step 1",
          description: "Description 1",
          priority: "HIGH",
        },
      ],
    });

    const result = await useCase.execute(input);

    expect(result.sessionQuizId).toBe(SESSION_QUIZ_ID);
    expect(result.score.user).toBe(50); // 1/2
    expect(result.score.community).toBe(65); // (60+70)/2 = 65

    expect(result.correctAnswers).toBe(1);
    expect(result.wrongAnswers).toBe(1);
    expect(
      mockQuizReportSaveSubmitPrismaRepository.execute,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionQuizId: SESSION_QUIZ_ID,
        correctAnswers: 1,
        wrongAnswers: 1,
      }),
      [],
      [],
    );
  });

  it("should ignore disliked questions in the feedback flow", async () => {
    const input: any = {
      userId: "user-123",
      sessionQuizId: SESSION_QUIZ_ID,
      answers: [
        {
          quizQuestionId: "q1-uuid",
          selectedCorrectOption: true,
          isDisliked: false,
        },
        {
          quizQuestionId: "q2-uuid",
          selectedCorrectOption: false,
          isDisliked: true,
        },
      ],
    };

    mockQuizQuestionRepository.findManyByIds.mockResolvedValue(mockQuestions);
    mockSessionQuizRepository.findById.mockResolvedValue(mockSession);
    mockSessionQuizResultRepository.findManyScoreBySeniority.mockResolvedValue([
      60, 70,
    ]);
    mockSessionQuizSubjectRepository.findAverageScoreByContext.mockResolvedValue(
      [{ subjectId: 10, averageScore: 65 }],
    );
    mockSessionQuizStackRepository.findAverageScoreByContext.mockResolvedValue([
      { stackId: 20, averageScore: 60 },
    ]);

    mockGeminiProvider.generateQuizInsights.mockResolvedValue({
      insights: {
        title: "Test Insights",
        description: "Test Description",
        strongPoints: ["Point 1"],
        weakPoints: ["Point 2"],
      },
      roadmap: [],
    });

    const result = await useCase.execute(input);

    expect(result.score.user).toBe(100); // 1/1 (q2 is ignored)
    expect(result.correctAnswers).toBe(1);
    expect(result.wrongAnswers).toBe(0);
    expect(result.stacks).toHaveLength(1); // only stack from q1
    expect(result.stacks[0].id).toBe(20);

    // Verify Gemini was called only with q1 statement
    expect(mockGeminiProvider.generateQuizInsights).toHaveBeenCalledWith(
      expect.objectContaining({
        wrongQuestions: [], // q2 was wrong but it was disliked, so it's ignored
      }),
    );

    // Verify repository was called with liked and disliked question ids
    expect(
      mockQuizReportSaveSubmitPrismaRepository.execute,
    ).toHaveBeenCalledWith(expect.anything(), [], ["q2-uuid"]);
  });

  it("should throw NotFoundError if session not found", async () => {
    mockQuizQuestionRepository.findManyByIds.mockResolvedValue([]);
    mockSessionQuizRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: "user-123",
        sessionQuizId: "33333333-3333-4333-8333-333333333333",
        answers: [
          {
            quizQuestionId: "q1-uuid",
            selectedCorrectOption: true,
            isDisliked: false,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw ForbiddenError if session belongs to another user", async () => {
    mockQuizQuestionRepository.findManyByIds.mockResolvedValue(mockQuestions);
    mockSessionQuizRepository.findById.mockResolvedValue({
      ...mockSession,
      userId: "other-user",
    });

    await expect(
      useCase.execute({
        userId: "user-123",
        sessionQuizId: SESSION_QUIZ_ID,
        answers: [
          {
            quizQuestionId: "q1-uuid",
            selectedCorrectOption: true,
            isDisliked: false,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("should throw ConflictError if quiz report was already submitted", async () => {
    mockQuizQuestionRepository.findManyByIds.mockResolvedValue(mockQuestions);
    mockSessionQuizRepository.findById.mockResolvedValue({
      ...mockSession,
      status: SessionQuizStatus.COMPLETED,
    });

    await expect(
      useCase.execute({
        userId: "user-123",
        sessionQuizId: SESSION_QUIZ_ID,
        answers: [
          {
            quizQuestionId: "q1-uuid",
            selectedCorrectOption: true,
            isDisliked: false,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("should throw NotFoundError if question not found in loaded context", async () => {
    mockQuizQuestionRepository.findManyByIds.mockResolvedValue([]);
    mockSessionQuizRepository.findById.mockResolvedValue(mockSession);

    await expect(
      useCase.execute({
        userId: "user-123",
        sessionQuizId: SESSION_QUIZ_ID,
        answers: [
          {
            quizQuestionId: "q1-uuid",
            selectedCorrectOption: true,
            isDisliked: false,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
