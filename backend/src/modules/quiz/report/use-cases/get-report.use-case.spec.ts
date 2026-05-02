import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { NotFoundError, BadRequestError } from "@/shared/app.error";

jest.mock("@/../prisma/client", () => ({
  prisma: {},
}));

jest.mock("@/infra/database/prisma/quiz/report/get-quiz-report.prisma.repository");

import { GetReportUseCase } from "./get-report.use-case";
import {
  SessionQuizStatus,
  SessionQuizRoadmapPriority,
} from "generated/prisma/enums";

const makeGetQuizReportRepository = () => ({
  execute: jest.fn(),
});

const makeSut = () => {
  const getQuizReportRepository = makeGetQuizReportRepository();
  const sut = new GetReportUseCase(getQuizReportRepository as any);
  return { sut, getQuizReportRepository };
};

describe("GetReportUseCase", () => {
  const sessionQuizId = "4032d184-7546-4c28-9177-3e4070a79051";

  it("should be able to get a quiz report", async () => {
    const { sut, getQuizReportRepository } = makeSut();

    const mockReport = {
      id: sessionQuizId,
      status: SessionQuizStatus.COMPLETED,
      result: {
        score: 80,
        averageScore: 70,
        percentile: 90,
        ranking: 5,
        correctAnswers: 8,
        wrongAnswers: 2,
        ignoredAnswers: 0,
        title: "Parabéns!",
        description: "Você mandou bem.",
        strongPoints: ["Lógica"],
        weakPoints: ["Sintaxe"],
      },
      stacks: [
        {
          stackId: 1,
          score: 85,
          averageScore: 75,
          stack: { name: "TypeScript" },
        },
      ],
      subjects: [
        {
          subjectId: 1,
          score: 80,
          averageScore: 70,
          subject: { name: "Web" },
        },
      ],
      roadmaps: [
        {
          title: "Aprenda NestJS",
          description: "Ótimo para backend.",
          priority: SessionQuizRoadmapPriority.HIGH,
        },
      ],
    };

    getQuizReportRepository.execute.mockResolvedValue(mockReport);

    const result = await sut.execute({ sessionQuizId });

    expect(result).toHaveProperty("sessionQuizId", sessionQuizId);
    expect(result.score.user).toBe(80);
    expect(result.stacks[0].name).toBe("TypeScript");
    expect(getQuizReportRepository.execute).toHaveBeenCalledWith(sessionQuizId);
  });

  it("should throw NotFoundError if session is not found", async () => {
    const { sut, getQuizReportRepository } = makeSut();
    getQuizReportRepository.execute.mockResolvedValue(null);

    await expect(sut.execute({ sessionQuizId })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should throw BadRequestError if session status is not COMPLETED", async () => {
    const { sut, getQuizReportRepository } = makeSut();

    getQuizReportRepository.execute.mockResolvedValue({
      status: SessionQuizStatus.IN_PROGRESS,
    });

    await expect(sut.execute({ sessionQuizId })).rejects.toBeInstanceOf(
      BadRequestError,
    );
    await expect(sut.execute({ sessionQuizId })).rejects.toThrow(
      "Quiz session is not COMPLETED yet",
    );
  });

  it("should throw NotFoundError if result is missing despite being COMPLETED", async () => {
    const { sut, getQuizReportRepository } = makeSut();

    getQuizReportRepository.execute.mockResolvedValue({
      id: sessionQuizId,
      status: SessionQuizStatus.COMPLETED,
      result: null,
    });

    await expect(sut.execute({ sessionQuizId })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
