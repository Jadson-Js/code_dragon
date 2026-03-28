import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { CreateProfileUseCase } from "./create-profile";
import { GetOnboardingOptionsUseCase } from "./get-onboarding-options";
import { GetProfileByUserIdUseCase } from "./get-profile-by-user-id";
import { NotFoundError } from "@/shared/app.error";

// ─── CreateProfileUseCase ─────────────────────────────────────────────────────

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

// ─── GetOnboardingOptionsUseCase ──────────────────────────────────────────────

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

// ─── GetProfileByUserIdUseCase ────────────────────────────────────────────────

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
