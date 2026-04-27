import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const bcryptMock = {
  hash: jest.fn<(payload: string, rounds: number) => Promise<string>>(),
  compare: jest.fn<(payload: string, hash: string) => Promise<boolean>>(),
};

jest.unstable_mockModule("bcrypt", () => ({
  default: bcryptMock,
}));

let HashProvider: {
  new (): {
    hash(payload: string): Promise<string>;
    compare(payload: string, hash: string): Promise<boolean>;
  };
};

describe("HashProvider", () => {
  beforeAll(async () => {
    ({ HashProvider } = await import("./hash.provider"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should hash payload with configured rounds", async () => {
    bcryptMock.hash.mockResolvedValue("hashed-value");
    const provider = new HashProvider();

    const result = await provider.hash("plain");

    expect(result).toBe("hashed-value");
    expect(bcryptMock.hash).toHaveBeenCalledWith("plain", 10);
  });

  it("should compare payload and hash", async () => {
    bcryptMock.compare.mockResolvedValue(true);
    const provider = new HashProvider();

    const result = await provider.compare("plain", "hash");

    expect(result).toBe(true);
    expect(bcryptMock.compare).toHaveBeenCalledWith("plain", "hash");
  });
});
