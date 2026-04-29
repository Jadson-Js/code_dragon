import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const txMock = {
  sessionQuiz: {
    update: jest.fn<any>(),
  },
  sessionQuizStack: {
    update: jest.fn<any>(),
  },
  sessionQuizSubject: {
    update: jest.fn<any>(),
  },
  sessionQuizResult: {
    create: jest.fn<any>(),
  },
  sessionQuizRoadmap: {
    create: jest.fn<any>(),
  },
  quizQuestion: {
    update: jest.fn<any>(),
  },
};

const prismaMock = {
  $transaction: jest.fn<any>((callback: any) => callback(txMock)),
};

jest.unstable_mockModule("../../../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let QuizReportSaveSubmitPrismaRepository: any;

describe("QuizReportSaveSubmitPrismaRepository", () => {
  beforeAll(async () => {
    ({ QuizReportSaveSubmitPrismaRepository } =
      await import("./quiz-report-save-submit.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should execute all operations within a transaction", async () => {
    const repository = new QuizReportSaveSubmitPrismaRepository();
    const mockData: any = {
      sessionQuizId: "session-123",
      score: { user: 80, community: 70 },
      percentile: 90,
      ranking: 1,
      correctAnswers: 8,
      wrongAnswers: 2,
      ignoredAnswers: 0,
      stacks: [{ id: 1, score: { user: 85, community: 75 } }],
      subjects: [{ id: 2, score: { user: 80, community: 70 } }],
      insights: {
        title: "Test Title",
        description: "Test Desc",
        strongPoints: ["P1"],
        weakPoints: ["W1"],
      },
      roadmap: [{ title: "R1", description: "D1", priority: "HIGH" }],
    };

    await repository.execute(mockData, [], []);

    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(txMock.sessionQuiz.update).toHaveBeenCalledWith({
      where: { id: "session-123" },
      data: { status: "COMPLETED" },
    });

    expect(txMock.sessionQuizStack.update).toHaveBeenCalledWith({
      where: {
        quizSessionId_stackId: {
          quizSessionId: "session-123",
          stackId: 1,
        },
      },
      data: {
        score: 85,
        averageScore: 75,
      },
    });

    expect(txMock.sessionQuizSubject.update).toHaveBeenCalledWith({
      where: {
        quizSessionId_subjectId: {
          quizSessionId: "session-123",
          subjectId: 2,
        },
      },
      data: {
        score: 80,
        averageScore: 70,
      },
    });

    expect(txMock.sessionQuizResult.create).toHaveBeenCalledWith({
      data: {
        quizSessionId: "session-123",
        score: 80,
        averageScore: 70,
        title: "Test Title",
        description: "Test Desc",
        strongPoints: ["P1"],
        weakPoints: ["W1"],
        correctAnswers: 8,
        wrongAnswers: 2,
        ignoredAnswers: 0,
        ranking: 1,
        percentile: 90,
      },
    });

    expect(txMock.sessionQuizRoadmap.create).toHaveBeenCalledWith({
      data: {
        quizSessionId: "session-123",
        title: "R1",
        description: "D1",
        priority: "HIGH",
      },
    });
  });

  it("should increment dislikes for disliked questions", async () => {
    const repository = new QuizReportSaveSubmitPrismaRepository();
    const mockData: any = {
      sessionQuizId: "session-123",
      score: { user: 80, community: 70 },
      percentile: 90,
      ranking: 1,
      correctAnswers: 8,
      wrongAnswers: 2,
      ignoredAnswers: 0,
      stacks: [],
      subjects: [],
      insights: {
        title: "T",
        description: "D",
        strongPoints: [],
        weakPoints: [],
      },
      roadmap: [],
    };

    await repository.execute(mockData, [], ["q1-uuid", "q2-uuid"]);

    expect(txMock.quizQuestion.update).toHaveBeenCalledTimes(2);
    expect(txMock.quizQuestion.update).toHaveBeenCalledWith({
      where: { id: "q1-uuid" },
      data: { dislikes: { increment: 1 } },
    });
    expect(txMock.quizQuestion.update).toHaveBeenCalledWith({
      where: { id: "q2-uuid" },
      data: { dislikes: { increment: 1 } },
    });
  });

  it("should increment likes for liked questions", async () => {
    const repository = new QuizReportSaveSubmitPrismaRepository();
    const mockData: any = {
      sessionQuizId: "session-123",
      score: { user: 80, community: 70 },
      percentile: 90,
      ranking: 1,
      correctAnswers: 8,
      wrongAnswers: 2,
      ignoredAnswers: 0,
      stacks: [],
      subjects: [],
      insights: {
        title: "T",
        description: "D",
        strongPoints: [],
        weakPoints: [],
      },
      roadmap: [],
    };

    await repository.execute(mockData, ["q1-uuid"], []);

    expect(txMock.quizQuestion.update).toHaveBeenCalledWith({
      where: { id: "q1-uuid" },
      data: { likes: { increment: 1 } },
    });
  });
});
