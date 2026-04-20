import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { GetProfileByUserIdUseCase } from "./get-profile-by-user-id";
import { NotFoundError } from "@/shared/app.error";

describe("GetProfileByUserIdUseCase", () => {
  function makeUseCase() {
    const repo = {
      execute: jest.fn<(userId: string) => Promise<unknown>>(),
    };
    const useCase = new GetProfileByUserIdUseCase(repo as never);
    return { useCase, repo };
  }

  it("should return the profile when it exists", async () => {
    const { useCase, repo } = makeUseCase();
    const fakeProfile = { id: "prof-1", userId: "user-1" };
    repo.execute.mockResolvedValue(fakeProfile);

    const result = await useCase.execute("user-1");

    expect(repo.execute).toHaveBeenCalledWith("user-1");
    expect(result).toEqual(fakeProfile);
  });

  it("should throw NotFoundError when profile does not exist", async () => {
    const { useCase, repo } = makeUseCase();
    repo.execute.mockResolvedValue(null);

    await expect(useCase.execute("user-1")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should propagate repository errors", async () => {
    const { useCase, repo } = makeUseCase();
    repo.execute.mockRejectedValue(new Error("DB error"));

    await expect(useCase.execute("user-1")).rejects.toThrow("DB error");
  });
});
