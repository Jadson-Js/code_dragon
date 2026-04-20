import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { GetOnboardingOptionsUseCase } from "./get-onboarding-options";

const fakeOptions = {
  ageRanges: [],
  seniorities: [],
  specialties: [],
  careerObjectives: [],
  stacks: [],
};

describe("GetOnboardingOptionsUseCase", () => {
  function makeUseCase() {
    const dbRepo = {
      execute: jest.fn<() => Promise<typeof fakeOptions>>(),
    };
    const redisRepo = {
      exists: jest.fn<() => Promise<boolean>>(),
      get: jest.fn<() => Promise<typeof fakeOptions | null>>(),
      set: jest.fn<(data: unknown, ttl: number) => Promise<void>>(),
    };
    const useCase = new GetOnboardingOptionsUseCase(
      dbRepo as never,
      redisRepo as never,
    );
    return { useCase, dbRepo, redisRepo };
  }

  it("should return cached data from Redis when it exists", async () => {
    const { useCase, dbRepo, redisRepo } = makeUseCase();
    redisRepo.exists.mockResolvedValue(true);
    redisRepo.get.mockResolvedValue(fakeOptions);

    const result = await useCase.execute();

    expect(result).toEqual(fakeOptions);
    expect(dbRepo.execute).not.toHaveBeenCalled();
  });

  it("should fall through to DB when Redis exists returns true but get returns null", async () => {
    const { useCase, dbRepo, redisRepo } = makeUseCase();
    redisRepo.exists.mockResolvedValue(true);
    redisRepo.get.mockResolvedValue(null);
    dbRepo.execute.mockResolvedValue(fakeOptions);

    const result = await useCase.execute();

    expect(dbRepo.execute).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeOptions);
    expect(redisRepo.set).toHaveBeenCalledWith(fakeOptions, 86400);
  });

  it("should fetch from DB when cache does not exist and set in Redis", async () => {
    const { useCase, dbRepo, redisRepo } = makeUseCase();
    redisRepo.exists.mockResolvedValue(false);
    dbRepo.execute.mockResolvedValue(fakeOptions);

    const result = await useCase.execute();

    expect(dbRepo.execute).toHaveBeenCalledTimes(1);
    expect(redisRepo.set).toHaveBeenCalledWith(fakeOptions, 86400);
    expect(result).toEqual(fakeOptions);
  });
});
