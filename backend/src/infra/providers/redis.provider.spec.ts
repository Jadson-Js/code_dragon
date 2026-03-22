import "reflect-metadata";
import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";

const redisConnectionMock = {
  get: jest.fn<(key: string) => Promise<string | null>>(),
  setex: jest.fn<(key: string, ttlSeconds: number, value: string) => Promise<void>>(),
  del: jest.fn<(key: string) => Promise<void>>(),
  exists: jest.fn<(key: string) => Promise<number>>(),
  incr: jest.fn<(key: string) => Promise<number>>(),
  expire: jest.fn<(key: string, ttlSeconds: number) => Promise<void>>(),
};

jest.unstable_mockModule("../database/redis/connection", () => ({
  redisConnection: redisConnectionMock,
}));

let RedisProvider: {
  new (): {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds: number): Promise<void>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    incr(key: string): Promise<number>;
    expire(key: string, ttlSeconds: number): Promise<void>;
  };
};

describe("RedisProvider", () => {
  beforeAll(async () => {
    ({ RedisProvider } = await import("./redis.provider"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should proxy get/set/delete operations", async () => {
    redisConnectionMock.get.mockResolvedValue("value");
    const provider = new RedisProvider();

    await expect(provider.get("k")).resolves.toBe("value");
    await provider.set("k", "v", 30);
    await provider.delete("k");

    expect(redisConnectionMock.setex).toHaveBeenCalledWith("k", 30, "v");
    expect(redisConnectionMock.del).toHaveBeenCalledWith("k");
  });

  it("should map exists numeric response to boolean", async () => {
    const provider = new RedisProvider();
    redisConnectionMock.exists.mockResolvedValueOnce(1).mockResolvedValueOnce(0);

    await expect(provider.exists("k")).resolves.toBe(true);
    await expect(provider.exists("k")).resolves.toBe(false);
  });

  it("should proxy incr/expire", async () => {
    const provider = new RedisProvider();
    redisConnectionMock.incr.mockResolvedValue(2);

    await expect(provider.incr("k")).resolves.toBe(2);
    await provider.expire("k", 10);

    expect(redisConnectionMock.expire).toHaveBeenCalledWith("k", 10);
  });
});
