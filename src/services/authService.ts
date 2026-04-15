import bcrypt from "bcryptjs";

import { User } from "../models/User";
import { HttpError } from "../utils/httpError";
import { signToken } from "../utils/jwt";

type AuthInput = {
  email: string;
  password: string;
};

type SafeUserRecord = Record<string, unknown> & {
  role: "admin" | "user";
  email: string;
};

export const sanitizeUser = (user: Record<string, unknown>) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

export const getAuthSetupStatus = async () => {
  const adminCount = await User.countDocuments({ role: "admin" });

  return {
    hasAdmin: adminCount > 0,
    canRegisterAdmin: adminCount === 0,
    registerRoles: adminCount === 0 ? (["user", "admin"] as const) : (["user"] as const),
    loginRoles: ["user", "admin"] as const
  };
};

export const registerUser = async ({
  name,
  email,
  password,
  role
}: AuthInput & {
  name: string;
  role: "admin" | "user";
}) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new HttpError(409, "An account with this email already exists.");
  }

  if (role === "admin") {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      throw new HttpError(409, "An admin account already exists. New registrations can only be readers now.");
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
    role,
    onboardingCompleted: role === "admin",
    preferences: role === "admin" ? ["General", "World", "Technology", "Business"] : []
  });

  const userJson = user.toJSON() as SafeUserRecord;

  return {
    token: signToken({
      userId: user.id,
      role: user.role as "admin" | "user",
      email: user.email as string
    }),
    user: sanitizeUser(userJson)
  };
};

export const loginUser = async ({ email, password, role }: AuthInput & { role?: "admin" | "user" }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new HttpError(401, "Invalid email or password.");
  }

  if (role && user.role !== role) {
    throw new HttpError(403, `This account is registered as a ${user.role}, not a ${role}.`);
  }

  const userJson = user.toJSON() as SafeUserRecord;

  return {
    token: signToken({
      userId: user.id,
      role: user.role as "admin" | "user",
      email: user.email as string
    }),
    user: sanitizeUser(userJson)
  };
};
