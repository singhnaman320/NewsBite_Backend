import { Request, Response } from "express";

import { User } from "../models/User";
import { getAuthSetupStatus, loginUser, registerUser } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "user";
  };

  if (!name || !email || !password || !role) {
    throw new HttpError(400, "Name, email, password, and role are required.");
  }

  const result = await registerUser({ name, email, password, role });
  res.status(201).json({ ...result, message: "Registration completed successfully. Please log in to continue." });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body as {
    email?: string;
    password?: string;
    role?: "admin" | "user";
  };

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required.");
  }

  const result = await loginUser({ email, password, role });
  res.json({ ...result, message: "Login successful." });
});

export const getSetupStatus = asyncHandler(async (_req: Request, res: Response) => {
  const status = await getAuthSetupStatus();
  res.json(status);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, "Authentication required.");
  }

  const user = await User.findById(req.user.userId).select("-passwordHash");
  if (!user) {
    throw new HttpError(404, "User not found.");
  }

  res.json({ user });
});
