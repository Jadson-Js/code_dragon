import "reflect-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@/shared/app.error";
import { EnsureAuthenticated } from "./ensure-authenticated.middleware";

describe("EnsureAuthenticated middleware", () => {
  it("authAccess should throw when access token is missing", async () => {
    const middleware = new EnsureAuthenticated(
      {
        verifyAccessToken: jest.fn<(token: string) => Promise<boolean>>(),
        decodeToken: jest.fn<(token: string) => Promise<{ sub: string }>>(),
      } as never,
      { exists: jest.fn<(key: string) => Promise<boolean>>() } as never,
    );

    const request = { cookies: {} } as unknown as Request;

    await expect(
      middleware.authAccess(
        request,
        {} as Response,
        jest.fn() as unknown as NextFunction,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("authAccess should set request.user and call next on valid token", async () => {
    const next = jest.fn() as unknown as NextFunction;
    const middleware = new EnsureAuthenticated(
      {
        verifyAccessToken: jest.fn(async (_token: string) => true),
        decodeToken: jest.fn(async (_token: string) => ({ sub: "user-1" })),
      } as never,
      { exists: jest.fn<(key: string) => Promise<boolean>>() } as never,
    );

    const request = {
      cookies: { accessToken: "access-token" },
    } as unknown as Request;

    await middleware.authAccess(request, {} as Response, next);

    expect(request.user.id).toBe("user-1");
    expect(next).toHaveBeenCalledWith();
  });

  it("authRefresh should throw when session does not exist in redis", async () => {
    const middleware = new EnsureAuthenticated(
      {
        verifyRefreshToken: jest.fn(async (_token: string) => true),
        decodeToken: jest.fn(async (_token: string) => ({ sub: "user-1" })),
      } as never,
      { exists: jest.fn(async (_key: string) => false) } as never,
    );

    const request = {
      cookies: { refreshToken: "refresh-token" },
    } as unknown as Request;

    await expect(
      middleware.authRefresh(
        request,
        {} as Response,
        jest.fn() as unknown as NextFunction,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("authRefresh should set request.user and call next on valid session", async () => {
    const next = jest.fn() as unknown as NextFunction;
    const middleware = new EnsureAuthenticated(
      {
        verifyRefreshToken: jest.fn(async (_token: string) => true),
        decodeToken: jest.fn(async (_token: string) => ({ sub: "user-1" })),
      } as never,
      { exists: jest.fn(async (_key: string) => true) } as never,
    );

    const request = {
      cookies: { refreshToken: "refresh-token" },
    } as unknown as Request;

    await middleware.authRefresh(request, {} as Response, next);

    expect(request.user.id).toBe("user-1");
    expect(next).toHaveBeenCalledWith();
  });
});
