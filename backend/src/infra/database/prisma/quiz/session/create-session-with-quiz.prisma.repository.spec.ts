import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { SessionQuiz } from "@/entities/session-quiz.entity";
import { SessionQuizStatus } from "generated/prisma/enums";

const prismaMock = {
  $transaction: jest.fn<any>(),
  session: {
    create: jest.fn<any>(),
  },
  sessionQuiz: {
    create: jest.fn<any>(),
  },
  quizSessionStack: {
    createMany: jest.fn<any>(),
  },
  quizSessionSubjects: {
    createMany: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let CreateSessionWithQuizPrismaRepository: any;

describe("CreateSessionWithQuizPrismaRepository", () => {
  beforeAll(async () => {
    const module = await import("./create-session-with-quiz.prisma.repository");
    CreateSessionWithQuizPrismaRepository = module.CreateSessionWithQuizPrismaRepository;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a session with quiz in a transaction", async () => {
    const repository = new CreateSessionWithQuizPrismaRepository();
    const now = new Date();
    const sessionQuiz = SessionQuiz.create({
      id: "sq-1",
      sessionId: "will-be-replaced",
      userId: "u-1",
      seniorityId: 1,
      specialtyId: 2,
      quizObjectiveId: 3,
      quantityQuestions: 10,
    });

    const input = {
      session: {
        userId: "u-1",
        featureId: 1,
      },
      sessionQuiz,
      stacksId: [1, 2],
      quizSubjectsId: [3, 4],
    };

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      return await callback(prismaMock);
    });

    prismaMock.session.create.mockResolvedValue({ id: "s-1" });
    prismaMock.sessionQuiz.create.mockResolvedValue({
      ...sessionQuiz,
      sessionId: "s-1",
      get toDomain() {
        return SessionQuiz.create(this as any);
      },
    });

    const result = await repository.execute(input);

    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(prismaMock.session.create).toHaveBeenCalledWith({
      data: {
        userId: "u-1",
        featureId: 1,
      },
    });
    expect(prismaMock.sessionQuiz.create).toHaveBeenCalled();
    expect(prismaMock.quizSessionStack.createMany).toHaveBeenCalled();
    expect(prismaMock.quizSessionSubjects.createMany).toHaveBeenCalled();
    expect(result.sessionQuiz).toBeInstanceOf(SessionQuiz);
  });
});
