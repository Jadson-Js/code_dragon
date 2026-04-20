import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { CreateProfileUseCase } from "./create-profile";

describe("CreateProfileUseCase", () => {
  function makeUseCase() {
    const repo = {
      execute: jest.fn<(params: unknown) => Promise<{ id: string }>>(),
    };
    const useCase = new CreateProfileUseCase(repo as never);
    return { useCase, repo };
  }

  it("should delegate to the repository and return its result", async () => {
    const { useCase, repo } = makeUseCase();
    const input = {
      userId: "user-1",
      ageRangeId: 1,
      seniorityId: 2,
      specialtyId: 3,
      careerObjectiveId: 4,
      stacksId: [10, 11],
    };
    repo.execute.mockResolvedValue({ id: "profile-1" });

    const result = await useCase.execute(input as never);

    expect(repo.execute).toHaveBeenCalledTimes(1);
    expect(repo.execute).toHaveBeenCalledWith(input);
    expect(result).toEqual({ id: "profile-1" });
  });

  it("should propagate repository errors", async () => {
    const { useCase, repo } = makeUseCase();
    repo.execute.mockRejectedValue(new Error("DB error"));

    await expect(useCase.execute({} as never)).rejects.toThrow("DB error");
  });
});
