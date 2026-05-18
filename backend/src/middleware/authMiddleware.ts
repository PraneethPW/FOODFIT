import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./errorMiddleware.js";

type TokenPayload = {
  sub: string;
  email: string;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    throw new ApiError(401, "Session expired");
  }
};
