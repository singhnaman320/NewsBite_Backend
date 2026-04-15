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
    const duplicateKeyError = error as any;
    const field = Object.keys(duplicateKeyError.keyPattern || {})[0];
    const value = duplicateKeyError.keyValue?.[field];

    let message = "This already exists in our system.";

    if (field === "name") {
      message =
        "A feed agent with this name already exists. Please choose a different name.";
    } else if (field === "rssFeedUrl") {
      message =
        "This RSS feed URL is already being used by another agent. Please use a different URL.";
    } else if (field === "email") {
      message =
        "An account with this email already exists. Please use a different email.";
    } else if (field && value) {
      message = `The ${field} "${value}" already exists. Please use a different value.`;
    }

    return res.status(409).json({ message });
  }

  if (env.nodeEnv !== "production") {
    console.error(error);
  }

  return res.status(500).json({ message: "Something went wrong." });
};
