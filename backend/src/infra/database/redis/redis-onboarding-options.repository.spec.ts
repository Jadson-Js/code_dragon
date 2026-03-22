import "reflect-metadata";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const redisConnectionMock = {
  get: jest.fn(),
  setex: jest.fn(),
  exists: jest.fn(),
};

jest.unstable_mockModule("./connection", () => ({
  redisConnection: redisConnectionMock,
}));

const { RedisOnboardingOptionsRepository } = await import(
  "./redis-onboarding-options.repository"
);

describe("RedisOnboardingOptionsRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("get should return parsed object when key exists", async () => {
    const repository = new RedisOnboardingOptionsRepository();
    const payload = {
      seniorities: [],
      specialties: [],
      careerObjectives: [],
      ageRanges: [],
      stacks: [],
    };
    redisConnectionMock.get.mockResolvedValue(JSON.stringify(payload));

    const result = await repository.get();

    expect(redisConnectionMock.get).toHaveBeenCalledWith("onboarding-options");
    expect(result).toEqual(payload);
  });

  it("get should return null when key does not exist", async () => {
    const repository = new RedisOnboardingOptionsRepository();
    redisConnectionMock.get.mockResolvedValue(null);

    const result = await repository.get();

    expect(result).toBeNull();
  });

  it("set should persist serialized payload with ttl", async () => {
    const repository = new RedisOnboardingOptionsRepository();
    const payload = {
      seniorities: [{ id: 1, name: "Junior", description: "entry" }],
      specialties: [],
      careerObjectives: [],
      ageRanges: [],
      stacks: [],
    };

    await repository.set(payload, 60);

    expect(redisConnectionMock.setex).toHaveBeenCalledWith(
      "onboarding-options",
      60,
      JSON.stringify(payload),
    );
  });

  it("exists should map redis numeric response to boolean", async () => {
    const repository = new RedisOnboardingOptionsRepository();
    redisConnectionMock.exists.mockResolvedValueOnce(1).mockResolvedValueOnce(0);

    await expect(repository.exists()).resolves.toBe(true);
    await expect(repository.exists()).resolves.toBe(false);
  });
});
