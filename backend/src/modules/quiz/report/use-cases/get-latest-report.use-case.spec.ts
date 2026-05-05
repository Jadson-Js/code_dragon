import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { NotFoundError } from "@/shared/app.error";
import { GetLatestReportUseCase } from "./get-latest-report.use-case";
import {
  SessionQuizStatus,
  SessionQuizRoadmapPriority,
} from "generated/prisma/enums";

jest.mock("@/../prisma/client", () => ({
  prisma: {},
}));

jest.mock("@/infra/database/prisma/quiz/report/get-latest-quiz-report.prisma.repository");

// ─── Mocks ───────────────────────────────────────────────────────────────────
const makeGetLatestQuizReportRepository = () => ({
  execute: jest.fn(),
});

// ─── Factory ─────────────────────────────────────────────────────────────────
const makeSut = () => {
  const getLatestQuizReportRepository = makeGetLatestQuizReportRepository();
  const sut = new GetLatestReportUseCase(getLatestQuizReportRepository as any);
  return { sut, getLatestQuizReportRepository };
};

// ─── Suite ───────────────────────────────────────────────────────────────────
describe("GetLatestReportUseCase", () => {
  const userId = "user-123";

  it("should be able to get the latest quiz report for a user", async () => {
    const { sut, getLatestQuizReportRepository } = makeSut();

    const mockReport = {
      id: "session-quiz-id",
      sessionId: "session-id",
      status: SessionQuizStatus.COMPLETED,
      result: {
        score: 85,
        averageScore: 70,
        percentile: 92,
        ranking: 3,
        correctAnswers: 9,
        wrongAnswers: 1,
        ignoredAnswers: 0,
        title: "Excelente!",
        description: "Você está acima da média.",
        strongPoints: ["Lógica", "Sintaxe"],
        weakPoints: ["Performance"],
      },
      stacks: [
        {
          stackId: 1,
          score: 90,
          averageScore: 75,
          stack: { name: "TypeScript" },
        },
      ],
      subjects: [
        {
          subjectId: 1,
          score: 85,
          averageScore: 72,
          subject: { name: "Backend" },
        },
      ],
      roadmaps: [
        {
          title: "Microserviços",
          description: "Estude padrões distribuídos.",
          priority: SessionQuizRoadmapPriority.HIGH,
        },
      ],
    };

    getLatestQuizReportRepository.execute.mockResolvedValue(mockReport);

    const result = await sut.execute({ userId });

    expect(result).toHaveProperty("sessionQuizId", "session-quiz-id");
    expect(result.score.user).toBe(85);
    expect(result.insights.title).toBe("Excelente!");
    expect(getLatestQuizReportRepository.execute).toHaveBeenCalledWith(userId);
  });

  describe("when no completed quiz is found", () => {
    it("should throw NotFoundError with 'No completed quiz found for this user'", async () => {
      const { sut, getLatestQuizReportRepository } = makeSut();
      getLatestQuizReportRepository.execute.mockResolvedValue(null);

      await expect(sut.execute({ userId })).rejects.toThrow(
        new NotFoundError("No completed quiz found for this user"),
      );
    });
  });

  describe("when session quiz has no result record", () => {
    it("should throw NotFoundError if result is missing", async () => {
      const { sut, getLatestQuizReportRepository } = makeSut();

      getLatestQuizReportRepository.execute.mockResolvedValue({
        id: "session-quiz-id",
        status: SessionQuizStatus.COMPLETED,
        result: null,
      });

      await expect(sut.execute({ userId })).rejects.toThrow(
        new NotFoundError("Quiz report result not found"),
      );
    });
  });
});
