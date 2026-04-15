import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

export type JwtPayload = {
  userId: string;
  role: "admin" | "user";
  email: string;
};

export const signToken = (payload: JwtPayload) => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwtSecret as Secret, options);
};

export const verifyToken = (token: string) =>
  jwt.verify(token, env.jwtSecret as Secret) as JwtPayload;
