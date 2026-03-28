import "reflect-metadata";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

const prismaMockData = {
  profile: {
    findUnique: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../../prisma/client", () => ({
  prisma: prismaMockData,
}));

const { GetProfileByUserIdPrismaRepository } = await import(
  "./get-profile-by-user-id.repository"
);

describe("GetProfileByUserIdPrismaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProfile = {
    id: "prof-1",
    userId: "user-1",
    linkedinUrl: "https://linkedin.com/in/john",
    githubUrl: null,
    portfolioUrl: null,
    ageRangeId: 1,
    seniorityId: 2,
    specialtyId: 3,
    careerObjectiveId: 4,
    stacks: [{ stackId: 10 }, { stackId: 11 }],
  };

  it("should return the profile and stack IDs when it exists", async () => {
    const repository = new GetProfileByUserIdPrismaRepository();
    prismaMockData.profile.findUnique.mockResolvedValue(mockProfile);

    const result = await repository.execute("user-1");

    expect(prismaMockData.profile.findUnique).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      select: expect.any(Object),
    });

    expect(result).not.toBeNull();
    expect(result?.id).toBe("prof-1");
    expect(result?.stackIds).toEqual([10, 11]);
  });

  it("should return null when the profile is not found", async () => {
    const repository = new GetProfileByUserIdPrismaRepository();
    prismaMockData.profile.findUnique.mockResolvedValue(null);

    const result = await repository.execute("missing-user");

    expect(result).toBeNull();
  });

  it("should propagate errors from Prisma", async () => {
    const repository = new GetProfileByUserIdPrismaRepository();
    prismaMockData.profile.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(repository.execute("user-1")).rejects.toThrow("DB error");
  });
});
