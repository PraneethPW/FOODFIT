import { prisma } from "../config/prisma.js";
import { profileSchema, progressSchema } from "../schemas/profileSchemas.js";
import { calculateBmi, estimateTargets } from "../services/fitnessService.js";
import { isMissingTableError, localStore } from "../services/localStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  let profile;
  try {
    profile = await prisma.healthProfile.findUnique({ where: { userId: req.user!.id } });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    profile = localStore.getProfile(req.user!.id);
  }
  res.json({ profile, bmi: calculateBmi(profile), targets: estimateTargets(profile) });
});

export const upsertProfile = asyncHandler(async (req, res) => {
  const payload = profileSchema.parse(req.body);
  let profile;
  try {
    profile = await prisma.healthProfile.upsert({
      where: { userId: req.user!.id },
      create: { ...payload, userId: req.user!.id },
      update: payload
    });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    profile = localStore.upsertProfile(req.user!.id, payload);
  }
  res.json({ profile, bmi: calculateBmi(profile), targets: estimateTargets(profile) });
});

export const addProgress = asyncHandler(async (req, res) => {
  const payload = progressSchema.parse(req.body);
  let progress;
  try {
    progress = await prisma.progress.create({ data: { ...payload, userId: req.user!.id } });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    progress = localStore.addProgress(req.user!.id, payload);
  }
  res.status(201).json({ progress });
});

export const getProgress = asyncHandler(async (req, res) => {
  let progress;
  try {
    progress = await prisma.progress.findMany({
      where: { userId: req.user!.id },
      orderBy: { date: "asc" },
      take: 90
    });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    progress = localStore.getProgress(req.user!.id);
  }
  res.json({ progress });
});

export const overview = asyncHandler(async (req, res) => {
  let profile;
  let progress;
  let dietPlan;
  let workoutPlan;
  try {
    [profile, progress, dietPlan, workoutPlan] = await Promise.all([
      prisma.healthProfile.findUnique({ where: { userId: req.user!.id } }),
      prisma.progress.findMany({ where: { userId: req.user!.id }, orderBy: { date: "desc" }, take: 14 }),
      prisma.dietPlan.findFirst({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" } }),
      prisma.workoutPlan.findFirst({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" } })
    ]);
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    profile = localStore.getProfile(req.user!.id);
    progress = localStore.getProgress(req.user!.id);
    dietPlan = localStore.latestDietPlan(req.user!.id);
    workoutPlan = localStore.latestWorkoutPlan(req.user!.id);
  }

  res.json({
    profile,
    bmi: calculateBmi(profile),
    targets: estimateTargets(profile),
    progress: progress.reverse(),
    dietPlan,
    workoutPlan
  });
});
