import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { validate } from "./validate.middleware";

describe("validate middleware", () => {
  it("should parse payload and call next without error", async () => {
    const schema = z.object({
      body: z.object({
        email: z.email(),
      }),
    });
    const middleware = validate(schema);
    const next = jest.fn() as unknown as NextFunction;
    const request = {
      body: { email: "admin@admin.com" },
      query: {},
      params: {},
    } as unknown as Request;

    await middleware(request, {} as Response, next);

    expect(request.body).toEqual({ email: "admin@admin.com" });
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next with error when payload is invalid", async () => {
    const schema = z.object({
      body: z.object({
        email: z.email(),
      }),
    });
    const middleware = validate(schema);
    const next = jest.fn() as unknown as NextFunction;
    const request = {
      body: { email: "invalid-email" },
      query: {},
      params: {},
    } as unknown as Request;

    await middleware(request, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
