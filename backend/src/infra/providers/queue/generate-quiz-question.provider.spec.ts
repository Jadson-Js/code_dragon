import "reflect-metadata";
import { describe, expect, it, jest, beforeEach, beforeAll } from "@jest/globals";

jest.unstable_mockModule("bullmq", () => ({
    Queue: jest.fn(() => ({})),
    Worker: jest.fn(() => ({ on: jest.fn() })),
    Job: jest.fn(),
}));

jest.unstable_mockModule("@/infra/database/redis/connection", () => ({
    redisConnection: {}
}));

let GenerateQuizQuestionBullMQProvider: any;

describe("GenerateQuizQuestionBullMQProvider", () => {
    let geminiProvider: any;
    let quizQuestionRepository: any;
    let quizQuestionEventEmitter: any;
    let sessionQuizRepository: any;
    let provider: any;

    beforeAll(async () => {
        ({ GenerateQuizQuestionBullMQProvider } = await import("./generate-quiz-question.provider"));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        geminiProvider = {
            generateQuizQuestion: jest.fn(),
        };
        quizQuestionRepository = {
            createMany: jest.fn(),
            countBySessionQuizId: jest.fn(),
        };
        quizQuestionEventEmitter = {
            emitNewQuestions: jest.fn(),
            emitFinished: jest.fn(),
        };
        sessionQuizRepository = {
            updateStatus: jest.fn(),
        };

        provider = new GenerateQuizQuestionBullMQProvider(
            geminiProvider,
            quizQuestionRepository,
            quizQuestionEventEmitter,
            sessionQuizRepository
        );
    });

    it("should process and generate questions, then emit events", async () => {
        const jobData = {
            sessionQuiz: { id: "sq-1", quantityQuestions: 2 },
            seniority: { id: 1 },
            specialty: { id: 2 },
            quizObjective: { id: 3 },
        };
        const mockJob = { data: jobData } as any;

        const generatedQuestions = [
            { statement: "Q1", alternatives: [], correctAlternativeIndex: 0, code: null, stackId: 1, subjectId: 1 },
            { statement: "Q2", alternatives: [], correctAlternativeIndex: 1, code: "code", stackId: 2, subjectId: 2 },
        ];

        geminiProvider.generateQuizQuestion.mockResolvedValue(generatedQuestions);
        quizQuestionRepository.createMany.mockResolvedValue([{ id: "q-1" }, { id: "q-2" }]);
        quizQuestionRepository.countBySessionQuizId.mockResolvedValue(2);

        await provider.process(mockJob);

        expect(geminiProvider.generateQuizQuestion).toHaveBeenCalledWith(jobData);
        expect(quizQuestionRepository.createMany).toHaveBeenCalled();
        expect(quizQuestionEventEmitter.emitNewQuestions).toHaveBeenCalledWith({
            sessionQuizId: "sq-1",
            questions: [{ id: "q-1" }, { id: "q-2" }],
        });
        expect(sessionQuizRepository.updateStatus).toHaveBeenCalledWith("sq-1", "IN_PROGRESS");
        expect(quizQuestionEventEmitter.emitFinished).toHaveBeenCalledWith({
            sessionQuizId: "sq-1",
        });
    });

    it("should not mark as finished if count is less than quantity", async () => {
        const jobData = {
            sessionQuiz: { id: "sq-1", quantityQuestions: 10 },
            seniority: { id: 1 },
            specialty: { id: 2 },
            quizObjective: { id: 3 },
        };
        const mockJob = { data: jobData } as any;

        geminiProvider.generateQuizQuestion.mockResolvedValue([{ statement: "Q1" }]);
        quizQuestionRepository.createMany.mockResolvedValue([{ id: "q-1" }]);
        quizQuestionRepository.countBySessionQuizId.mockResolvedValue(5);

        await provider.process(mockJob);

        expect(sessionQuizRepository.updateStatus).not.toHaveBeenCalled();
        expect(quizQuestionEventEmitter.emitFinished).not.toHaveBeenCalled();
    });
});
