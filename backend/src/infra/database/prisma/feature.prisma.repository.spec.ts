import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const prismaMock = {
  feature: {
    findUnique: jest.fn<any>(),
  },
};

jest.unstable_mockModule("../../../../prisma/client", () => ({
  prisma: prismaMock,
}));

let FeaturePrismaRepository: {
  new (): {
    findBySlug(slug: string): Promise<any | null>;
  };
};

describe("FeaturePrismaRepository", () => {
  beforeAll(async () => {
    ({ FeaturePrismaRepository } = await import("./feature.prisma.repository"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("findBySlug should return feature when it exists", async () => {
    const repository = new FeaturePrismaRepository();
    const mockFeature = { id: 1, slug: "test-feature", enabled: true };
    prismaMock.feature.findUnique.mockResolvedValue(mockFeature);

    const result = await repository.findBySlug("test-feature");

    expect(prismaMock.feature.findUnique).toHaveBeenCalledWith({
      where: { slug: "test-feature" },
    });
    expect(result).toEqual(mockFeature);
  });

  it("findBySlug should return null when feature does not exist", async () => {
    const repository = new FeaturePrismaRepository();
    prismaMock.feature.findUnique.mockResolvedValue(null);

    const result = await repository.findBySlug("missing");

    expect(result).toBeNull();
  });
});
