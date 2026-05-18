import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

const accessOptions: SignOptions = {
  expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
};

const refreshOptions: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
};

export const signAccessToken = (user: { id: string; email: string }) =>
  jwt.sign({ email: user.email }, env.JWT_ACCESS_SECRET, { ...accessOptions, subject: user.id });

export const signRefreshToken = (user: { id: string; email: string }) =>
  jwt.sign({ email: user.email }, env.JWT_REFRESH_SECRET, { ...refreshOptions, subject: user.id });

export const hashToken = (token: string) => bcrypt.hash(token, 10);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; email: string };
