import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorMiddleware.js";
import { loginSchema, refreshSchema, signupSchema } from "../schemas/authSchemas.js";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../services/tokenService.js";
import { isMissingTableError, localStore } from "../services/localStore.js";

const publicUser = (user: { id: string; name: string; email: string; createdAt: Date }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

const issueTokens = async (user: { id: string; email: string }) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshTokenHash = await hashToken(refreshToken);
  if (user.id.startsWith("local-")) {
    localStore.updateRefreshToken(user.id, refreshTokenHash);
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash }
    });
  }
  return { accessToken, refreshToken };
};

const issueStatelessTokens = (user: { id: string; email: string }) => ({
  accessToken: signAccessToken(user),
  refreshToken: signRefreshToken(user)
});

export const signup = asyncHandler(async (req, res) => {
  const payload = signupSchema.parse(req.body);
  try {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) throw new ApiError(409, "Email is already registered");

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email.toLowerCase(),
        passwordHash: await bcrypt.hash(payload.password, 12),
        healthProfile: { create: {} }
      }
    });

    res.status(201).json({ user: publicUser(user), ...(await issueTokens(user)) });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (!isMissingTableError(error)) throw error;
    const localUser = await localStore.createUser(payload);
    res.status(201).json({
      user: publicUser(localUser),
      ...(await issueTokens(localUser))
    });
  }
});

export const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  try {
    const user = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(payload.password, user.passwordHash))) {
      throw new ApiError(401, "Invalid email or password");
    }

    res.json({ user: publicUser(user), ...(await issueTokens(user)) });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (!isMissingTableError(error)) throw error;
    const user = await localStore.validateUser(payload.email, payload.password);
    if (!user) throw new ApiError(401, "Invalid email or password");
    res.json({ user: publicUser(user), ...(await issueTokens(user)) });
  }
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = refreshSchema.parse(req.body);
  const payload = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user?.refreshTokenHash || !(await bcrypt.compare(refreshToken, user.refreshTokenHash))) {
    throw new ApiError(401, "Invalid refresh token");
  }

  res.json(await issueTokens(user));
});

export const me = asyncHandler(async (req, res) => {
  if (req.user!.id.startsWith("local-")) {
    const user = localStore.getUser(req.user!.id);
    if (!user) throw new ApiError(404, "User not found");
    return res.json({ user: publicUser(user), healthProfile: localStore.getProfile(user.id) });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { healthProfile: true }
    });
    if (!user) throw new ApiError(404, "User not found");
    res.json({ user: publicUser(user), healthProfile: user.healthProfile });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    const user = localStore.getUser(req.user!.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json({ user: publicUser(user), healthProfile: localStore.getProfile(user.id) });
  }
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user!.id.startsWith("local-")) {
    localStore.updateRefreshToken(req.user!.id, null);
  } else {
    await prisma.user.update({ where: { id: req.user!.id }, data: { refreshTokenHash: null } });
  }
  res.status(204).send();
});

