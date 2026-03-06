import { AppError } from "@/shared/app.error";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  console.error(`[Error] ${new Date().toISOString()}:`, error);

  // Handle Custom Application Errors
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  // Handle Validation Errors (Zod)
  if (error instanceof ZodError) {
    return response.status(400).json({
      status: "validation_error",
      message: "Validation failed",
      errors: error.flatten().fieldErrors,
    });
  }

  if ((error as any).code?.startsWith("P")) {
    if ((error as any).code === "P2002") {
      return response.status(409).json({
        status: "conflict",
        message: "This record already exists in the system.",
      });
    }
  }

  // Generic Internal Server Error
  return response.status(500).json({
    status: "internal_error",
    message: "An internal server error occurred.",
  });
}
