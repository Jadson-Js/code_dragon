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
    findUnique: jest.fn<any>(),
  },
};

const prismaMock = {
  $transaction: jest.fn<any>((callback: any) => callback(txMock)),
};

jest.unstable_mockModule("@/../prisma/client", () => ({
  prisma: prismaMock,
}));

let GetQuizReportPrismaRepository: any;

describe("GetQuizReportPrismaRepository", () => {
  beforeAll(async () => {
    ({ GetQuizReportPrismaRepository } =
      await import("./get-quiz-report.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should find unique session quiz with relations within a transaction", async () => {
    const repository = new GetQuizReportPrismaRepository();
    const sessionQuizId = "session-123";

    txMock.sessionQuiz.findUnique.mockResolvedValue({ id: sessionQuizId });

    const result = await repository.execute(sessionQuizId);

    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(txMock.sessionQuiz.findUnique).toHaveBeenCalledWith({
      where: { id: sessionQuizId },
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
    expect(result).toEqual({ id: sessionQuizId });
  });
});
