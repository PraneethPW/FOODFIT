import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    return res.status(422).json({
      message: "Validation failed",
      errors: error.flatten()
    });
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  res.status(statusCode).json({
    message: error.message || "Something went wrong"
  });
};
