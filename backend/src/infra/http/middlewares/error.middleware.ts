import { AppError } from "@/shared/app.error";
import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  console.error("Error:", error);

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: error.message,
    });
  }

  return response.status(500).json({
    error: "Internal server error",
  });
}
