import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import { quizQuestionGenerateSchema } from "./questions.schema";

describe("quizQuestionGenerateSchema", () => {
  const validBody = {
    quizObjectiveId: 1,
    seniorityId: 2,
    specialtyId: 3,
    stacksId: [10],
    quantity: 5,
    saveInProfile: false,
  };

  it("should accept a valid payload", async () => {
    await expect(
      quizQuestionGenerateSchema.parseAsync({ body: validBody }),
    ).resolves.toBeDefined();
  });

  it("should accept a valid payload with optional quizSubjectId", async () => {
    await expect(
      quizQuestionGenerateSchema.parseAsync({
        body: { ...validBody, quizSubjectId: [1, 2] },
      }),
    ).resolves.toBeDefined();
  });

  it("should reject when quizObjectiveId is missing", async () => {
    const { quizObjectiveId: _q, ...rest } = validBody;
    await expect(
      quizQuestionGenerateSchema.parseAsync({ body: rest }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("should reject when stacksId is empty", async () => {
    await expect(
      quizQuestionGenerateSchema.parseAsync({
        body: { ...validBody, stacksId: [] },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("should reject when quantity is 0", async () => {
    await expect(
      quizQuestionGenerateSchema.parseAsync({
        body: { ...validBody, quantity: 0 },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("should reject when quantity exceeds 20", async () => {
    await expect(
      quizQuestionGenerateSchema.parseAsync({
        body: { ...validBody, quantity: 21 },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("should reject when saveInProfile is not a boolean", async () => {
    await expect(
      quizQuestionGenerateSchema.parseAsync({
        body: { ...validBody, saveInProfile: "yes" },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
