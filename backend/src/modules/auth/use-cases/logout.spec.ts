import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import { LogoutUseCase } from "./logout";

describe("LogoutUseCase", () => {
  it("should delete refresh session key", async () => {
    const redisProvider = { delete: jest.fn<any>() };
    const useCase = new LogoutUseCase(redisProvider as never);

    await useCase.execute({
      userId: "user-1",
      refreshToken: "refresh-token",
    });

    expect(redisProvider.delete).toHaveBeenCalledTimes(1);
  });
});
