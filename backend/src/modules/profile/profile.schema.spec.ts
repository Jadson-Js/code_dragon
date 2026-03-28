import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import { createProfileSchema } from "./profile.schema";

describe("createProfileSchema", () => {
  const validBody = {
    ageRangeId: 1,
    seniorityId: 2,
    specialtyId: 3,
    careerObjectiveId: 4,
    stacksId: [10, 11],
  };

  it("should accept a valid payload", async () => {
    await expect(
      createProfileSchema.parseAsync({ body: validBody }),
    ).resolves.toBeDefined();
  });

  it("should reject when ageRangeId is missing", async () => {
    const { ageRangeId: _a, ...rest } = validBody;
    await expect(
      createProfileSchema.parseAsync({ body: rest }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("should reject when seniorityId is missing", async () => {
    const { seniorityId: _s, ...rest } = validBody;
    await expect(
      createProfileSchema.parseAsync({ body: rest }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("should reject when specialtyId is missing", async () => {
    const { specialtyId: _sp, ...rest } = validBody;
    await expect(
      createProfileSchema.parseAsync({ body: rest }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("should reject when careerObjectiveId is missing", async () => {
    const { careerObjectiveId: _c, ...rest } = validBody;
    await expect(
      createProfileSchema.parseAsync({ body: rest }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("should reject when stacksId is an empty array", async () => {
    await expect(
      createProfileSchema.parseAsync({ body: { ...validBody, stacksId: [] } }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("should reject when stacksId contains non-numbers", async () => {
    await expect(
      createProfileSchema.parseAsync({
        body: { ...validBody, stacksId: ["react"] },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
