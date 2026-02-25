import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: request.body,
        query: request.query,
        params: request.params,
      })) as Record<string, unknown>;

      request.body = parsed.body;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: "Validation failed",
          errors: error.format(),
        });
      }
      return next(error);
    }
  };
