import "reflect-metadata";
import { describe, expect, it, jest, beforeEach, afterEach } from "@jest/globals";
import { InternalServerError, TooManyRequestsError } from "@/shared/app.error";

const generateContentMock = jest.fn<any>();

jest.unstable_mockModule("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: generateContentMock,
    },
  })),
}));

const { GeminiProvider } = await import("./gemini.provider");

describe("GeminiProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockInput = {
    quizObjective: { name: "Test Obj", description: "Desc" },
    quizSubjects: [{ name: "Subject 1", description: "S1 Desc" }],
    seniority: { name: "Senior" },
    specialty: { name: "Backend" },
    stacks: [{ name: "Node.js" }],
    quantityPerBatch: 1,
  } as any;

  it("should generate and parse questions correctly", async () => {
    const provider = new GeminiProvider();
    const mockQuestions = [
      {
        statement: "Q1",
        alternatives: ["A", "B", "C", "D"],
        correctAlternativeIndex: 0,
        code: "const x = 1;",
      },
    ];

    generateContentMock.mockResolvedValue({
      text: JSON.stringify(mockQuestions),
    });

    const result = await provider.generateQuizQuestion(mockInput);

    expect(generateContentMock).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]!.statement).toBe("Q1");
    expect(result[0]!.code).toBe("const x = 1;");
  });

  it("should handle null code in response", async () => {
    const provider = new GeminiProvider();
    const mockQuestions = [
      {
        statement: "Q2",
        alternatives: ["A", "B", "C", "D"],
        correctAlternativeIndex: 1,
      },
    ];

    generateContentMock.mockResolvedValue({
      text: JSON.stringify(mockQuestions),
    });

    const result = await provider.generateQuizQuestion(mockInput);

    expect(result[0]!.code).toBeNull();
  });

  it("should throw InternalServerError if Gemini returns empty text", async () => {
    const provider = new GeminiProvider();
    generateContentMock.mockResolvedValue({ text: "" });

    await expect(provider.generateQuizQuestion(mockInput)).rejects.toThrow(
      "Failed to generate quiz questions",
    );
  });

  it("should throw InternalServerError if JSON parsing fails", async () => {
    const provider = new GeminiProvider();
    generateContentMock.mockResolvedValue({ text: "invalid json" });

    await expect(
      provider.generateQuizQuestion(mockInput),
    ).rejects.toBeInstanceOf(InternalServerError);
  });

  it("should work when quizSubjects is undefined", async () => {
    const provider = new GeminiProvider();
    generateContentMock.mockResolvedValue({ text: "[]" });

    const inputNoSubject = { ...mockInput, quizSubjects: undefined };
    await provider.generateQuizQuestion(inputNoSubject);

    expect(generateContentMock).toHaveBeenCalled();
  });

  describe("Retries", () => {
    beforeEach(() => {
      jest.spyOn(console, "warn").mockImplementation(() => {});
      jest.spyOn(global, "setTimeout").mockImplementation((fn: any) => {
        fn();
        return 0 as any;
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should retry up to 5 times on 429 error and then throw TooManyRequestsError", async () => {
      const provider = new GeminiProvider();
      const error429 = new Error("429 Too Many Requests");
      (error429 as any).status = 429;

      generateContentMock.mockRejectedValue(error429);

      await expect(provider.generateQuizQuestion(mockInput)).rejects.toBeInstanceOf(TooManyRequestsError);
      expect(generateContentMock).toHaveBeenCalledTimes(6);
    });

    it("should retry on 503 error and succeed if second attempt works", async () => {
      const provider = new GeminiProvider();
      const error503 = new Error("503 Service Unavailable");
      (error503 as any).status = 503;

      generateContentMock
        .mockRejectedValueOnce(error503)
        .mockResolvedValueOnce({ text: "[]" });

      const result = await provider.generateQuizQuestion(mockInput);

      expect(result).toEqual([]);
      expect(generateContentMock).toHaveBeenCalledTimes(2);
    });

    it("should retry on RESOURCE_EXHAUSTED message", async () => {
      const provider = new GeminiProvider();
      const errorRE = new Error("RESOURCE_EXHAUSTED");

      generateContentMock
        .mockRejectedValueOnce(errorRE)
        .mockResolvedValueOnce({ text: "[]" });

      const result = await provider.generateQuizQuestion(mockInput);

      expect(result).toEqual([]);
      expect(generateContentMock).toHaveBeenCalledTimes(2);
    });

    it("should throw original error if not retryable", async () => {
      const provider = new GeminiProvider();
      const fatalError = new Error("Fatal 400");
      (fatalError as any).status = 400;

      generateContentMock.mockRejectedValue(fatalError);

      await expect(provider.generateQuizQuestion(mockInput)).rejects.toThrow(
        "Fatal 400",
      );
      expect(generateContentMock).toHaveBeenCalledTimes(1);
    });
  });
});
