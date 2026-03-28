import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { InternalServerError } from "@/shared/app.error";

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
    quizSubject: [{ name: "Subject 1", description: "S1 Desc" }],
    seniority: { name: "Senior" },
    specialty: { name: "Backend" },
    stacks: [{ name: "Node.js" }],
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
        // code missing
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

  it("should work when quizSubject is undefined", async () => {
    const provider = new GeminiProvider();
    generateContentMock.mockResolvedValue({ text: "[]" });

    const inputNoSubject = { ...mockInput, quizSubject: undefined };
    await provider.generateQuizQuestion(inputNoSubject);

    expect(generateContentMock).toHaveBeenCalled();
  });
});
