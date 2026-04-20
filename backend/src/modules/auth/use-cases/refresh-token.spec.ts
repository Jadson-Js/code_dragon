import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { RefreshTokenUseCase } from "./refresh-token";

describe("RefreshTokenUseCase", () => {
  it("should rotate session and return new tokens", async () => {
    const redisProvider = { delete: jest.fn<any>(), set: jest.fn<any>() };
    const useCase = new RefreshTokenUseCase(
      {
        generateAccessToken: jest.fn(async () => "new-access"),
        generateRefreshToken: jest.fn(async () => "new-refresh"),
      } as never,
      redisProvider as never,
    );

    const result = await useCase.execute({
      userId: "user-1",
      refreshToken: "old",
    });

    expect(result.accessToken).toBe("new-access");
    expect(result.newRefreshToken).toBe("new-refresh");
    expect(redisProvider.delete).toHaveBeenCalledTimes(1);
    expect(redisProvider.set).toHaveBeenCalledTimes(1);
  });
});
