import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { SessionQuizStatus } from "generated/prisma/enums";

const txMock = {
  sessionQuiz: {
    findFirst: jest.fn<any>(),
  },
};

const prismaMock = {
  $transaction: jest.fn<any>((callback: any) => callback(txMock)),
};

jest.unstable_mockModule("@/../prisma/client", () => ({
  prisma: prismaMock,
}));

let GetLatestQuizReportPrismaRepository: any;

describe("GetLatestQuizReportPrismaRepository", () => {
  beforeAll(async () => {
    ({ GetLatestQuizReportPrismaRepository } =
      await import("./get-latest-quiz-report.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should find the latest completed session quiz for a user within a transaction", async () => {
    const repository = new GetLatestQuizReportPrismaRepository();
    const userId = "user-123";

    txMock.sessionQuiz.findFirst.mockResolvedValue({ id: "latest-session-id" });

    const result = await repository.execute(userId);

    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(txMock.sessionQuiz.findFirst).toHaveBeenCalledWith({
      where: {
        userId,
        status: SessionQuizStatus.COMPLETED,
        result: { isNot: null },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        result: true,
        stacks: {
          include: {
            stack: true,
          },
        },
        subjects: {
          include: {
            subject: true,
          },
        },
        roadmaps: true,
        session: true,
      },
    });
    expect(result).toEqual({ id: "latest-session-id" });
  });
});
