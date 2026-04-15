import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: error.message });
  }

  if ((error as { code?: number }).code === 11000) {
    return res
      .status(409)
      .json({ message: "A unique constraint was violated." });
  }

  if (env.nodeEnv !== "production") {
    console.error(error);
  }

  return res.status(500).json({ message: "Something went wrong." });
};
