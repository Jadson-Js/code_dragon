import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { GetMeUseCase } from "./get-me";
import { NotFoundError } from "@/shared/app.error";

describe("GetMeUseCase", () => {
  it("should throw NotFoundError when repository returns null", async () => {
    const useCase = new GetMeUseCase({
      execute: jest.fn(async () => null),
    } as never);
    await expect(useCase.execute("user-1")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should return repository data", async () => {
    const data = {
      user: { id: "user-1", isVerified: () => true },
      profile: null,
    } as any;
    const useCase = new GetMeUseCase({
      execute: jest.fn(async () => data),
    } as never);
    const result = await useCase.execute("user-1");
    expect(result).toEqual(data);
  });
});
