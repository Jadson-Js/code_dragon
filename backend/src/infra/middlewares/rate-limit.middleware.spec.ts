import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { NotFoundError, TooManyRequestsError } from "@/shared/app.error";
import { RateLimitMiddleware } from "./rate-limit.middleware";

describe("RateLimitMiddleware", () => {
  it("should throw NotFoundError when request has no ip", async () => {
    const middleware = new RateLimitMiddleware({
      incr: jest.fn<(key: string) => Promise<number>>(),
      expire: jest.fn<(key: string, ttlSeconds: number) => Promise<void>>(),
    } as never);
    const handler = middleware.handle({
      key: "login",
      max: 5,
      windowInMs: 60000,
    });

    await expect(
      handler(
        { ip: undefined, body: {} } as unknown as Request,
        {} as Response,
        jest.fn() as unknown as NextFunction,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should call expire when first request in window", async () => {
    const redisProvider = {
      incr: jest.fn(async (_key: string) => 1),
      expire: jest.fn(async (_key: string, _ttl: number) => undefined),
    };
    const middleware = new RateLimitMiddleware(redisProvider as never);
    const next = jest.fn() as unknown as NextFunction;
    const handler = middleware.handle({
      key: "login",
      max: 5,
      windowInMs: 60000,
    });

    await handler(
      { ip: "127.0.0.1", body: {} } as unknown as Request,
      {} as Response,
      next,
    );

    expect(redisProvider.expire).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should throw TooManyRequestsError when count exceeds max", async () => {
    const middleware = new RateLimitMiddleware({
      incr: jest.fn(async (_key: string) => 6),
      expire: jest.fn<(key: string, ttlSeconds: number) => Promise<void>>(),
    } as never);
    const handler = middleware.handle({
      key: "login",
      max: 5,
      windowInMs: 60000,
    });

    await expect(
      handler(
        { ip: "127.0.0.1", body: {} } as unknown as Request,
        {} as Response,
        jest.fn() as unknown as NextFunction,
      ),
    ).rejects.toBeInstanceOf(TooManyRequestsError);
  });

  it("should include email in redis key when useEmail is true", async () => {
    const redisProvider = {
      incr: jest.fn(async (_key: string) => 1),
      expire: jest.fn(async (_key: string, _ttl: number) => undefined),
    };
    const middleware = new RateLimitMiddleware(redisProvider as never);
    const handler = middleware.handle({
      key: "signup",
      max: 5,
      windowInMs: 60000,
      useEmail: true,
    });

    await handler(
      {
        ip: "127.0.0.1",
        body: { email: "admin@admin.com" },
      } as unknown as Request,
      {} as Response,
      jest.fn() as unknown as NextFunction,
    );

    expect(redisProvider.incr).toHaveBeenCalledWith(
      "ratelimit:signup:127.0.0.1:admin@admin.com",
    );
  });
});
