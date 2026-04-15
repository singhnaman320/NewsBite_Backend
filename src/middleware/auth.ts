import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError";
import { verifyToken } from "../utils/jwt";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Authentication required."));
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token."));
  }
};

export const requireRole =
  (role: "admin" | "user") => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "Authentication required."));
    }

    if (req.user.role !== role) {
      return next(new HttpError(403, "You do not have access to this resource."));
    }

    return next();
  };
