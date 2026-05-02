import type { NextFunction, Request, Response } from "express";
import { type ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: request.body,
        query: request.query,
        params: request.params,
      })) as Record<string, unknown>;

      request.body = parsed.body;

      return next();
    } catch (error) {
      return next(error);
    }
  };
