import { prisma } from "../config/prisma.js";
import { ApiError } from "../middleware/errorMiddleware.js";
import { chatSchema, Goal } from "../schemas/profileSchemas.js";
import { isMissingTableError, localStore } from "../services/localStore.js";
import { askOpenRouter, parseAiJson } from "../services/openRouterService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProfile = (userId: string) =>
  prisma.healthProfile.findUnique({ where: { userId } }).catch((error) => {
    if (!isMissingTableError(error)) throw error;
    return localStore.getProfile(userId);
  });

const safeAsk = async (intent: "diet" | "workout" | "foods" | "chat", profile: unknown, userPrompt: string, fallback?: string) => {
  try {
    return await askOpenRouter({ intent, profile, userPrompt });
  } catch (error) {
    if (fallback !== undefined) return fallback;
    const message = error instanceof Error ? error.message : "AI service unavailable";
    throw new ApiError(502, `AI generation failed: ${message}`);
  }
};

const toText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(", ");
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map(toText).filter(Boolean).join(", ");
  }
  return value == null ? "" : String(value);
};

const mealText = (day: Record<string, unknown>, key: "breakfast" | "lunch" | "snack" | "dinner") => {
  const direct = toText(day[key]);
  if (direct) return direct;
  const meals = day.meals as unknown;
  if (Array.isArray(meals)) {
    const match = meals.find((meal) => {
      const item = meal as Record<string, unknown>;
      return toText(item.name ?? item.meal ?? item.type).toLowerCase().includes(key);
    }) as Record<string, unknown> | undefined;
    return toText(match?.food ?? match?.dish ?? match?.items ?? match?.description);
  }
  if (meals && typeof meals === "object") {
    return toText((meals as Record<string, unknown>)[key]);
  }
  return "";
};

const normalizeDietPlan = (plan: any) => {
  const days = Array.isArray(plan?.days) ? plan.days : [];
  const normalizedDays = days.map((item: any, index: number) => {
    const day = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return {
      day: toText(day.day) || `Day ${index + 1}`,
      breakfast: mealText(day, "breakfast"),
      lunch: mealText(day, "lunch"),
      snack: mealText(day, "snack"),
      dinner: mealText(day, "dinner"),
      calories: Number(day.calories ?? plan?.calories ?? 0) || undefined
    };
  });

  if (normalizedDays.length < 7 || normalizedDays.some((day: { breakfast: string; lunch: string; snack: string; dinner: string }) => !day.breakfast || !day.lunch || !day.snack || !day.dinner)) {
    throw new ApiError(502, "AI returned an incomplete diet plan. Please generate again.");
  }

  return { ...plan, days: normalizedDays };
};

const normalizeWorkoutPlan = (plan: any) => {
  const schedule = Array.isArray(plan?.schedule) ? plan.schedule : [];
  if (!schedule.length) throw new ApiError(502, "AI returned an incomplete workout plan. Please generate again.");
  return {
    ...plan,
    schedule: schedule.map((item: any, index: number) => ({
      day: toText(item?.day) || `Day ${index + 1}`,
      focus: toText(item?.focus ?? item?.type ?? item?.goal) || "Training",
      workout: toText(item?.workout ?? item?.exercises ?? item?.session ?? item?.description),
      duration: toText(item?.duration ?? item?.time) || "30-45 min"
    }))
  };
};

const normalizeFoods = (foods: any, profile: any) => {
  const items = Array.isArray(foods?.items) ? foods.items : [];
  if (!items.length) throw new ApiError(502, "AI returned incomplete food recommendations. Please generate again.");
  return {
    ...foods,
    city: toText(foods?.city) || profile?.city || "Your city",
    items: items.map((item: any) => ({
      name: toText(item?.name ?? item?.food ?? item?.dish) || "Healthy local food",
      macros: toText(item?.macros ?? item?.macroDetails),
      nutrients: item?.nutrients ?? item?.keyNutrients ?? [],
      benefits: toText(item?.benefits ?? item?.healthBenefits),
      suitability: toText(item?.suitability ?? item?.diseaseSuitability)
    }))
  };
};

export const generateDietPlan = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user!.id);
  const content = await safeAsk(
    "diet",
    profile,
    "Generate a complete personalized 7-day diet plan. Return only JSON with keys: title, calories, proteinGrams, carbsGrams, fatGrams, days, notes. days must contain exactly 7 unique objects with day, breakfast, lunch, snack, dinner, calories. Every meal must name specific foods, portions, and local/cultural options based on the profile. Avoid repeated meals and avoid placeholder phrases."
  );

  const plan = normalizeDietPlan(parseAiJson(content, {
    title: "Balanced FOODFIT Weekly Plan",
    calories: 2100,
    proteinGrams: 110,
    carbsGrams: 230,
    fatGrams: 65,
    days: [],
    notes: "AI response could not be parsed; regenerate for a richer plan."
  }));

  const data = {
      userId: req.user!.id,
      title: String(plan.title ?? "FOODFIT Weekly Diet"),
      goal: profile?.goal ?? Goal.MAINTENANCE,
      calories: Number(plan.calories ?? 2100),
      proteinGrams: Number(plan.proteinGrams ?? 110),
      carbsGrams: Number(plan.carbsGrams ?? 230),
      fatGrams: Number(plan.fatGrams ?? 65),
      notes: String(plan.notes ?? ""),
      plan
  };
  let saved;
  try {
    saved = await prisma.dietPlan.create({ data });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    saved = localStore.addDietPlan(req.user!.id, { id: `local-diet-${Date.now()}`, ...data, createdAt: new Date() });
  }

  res.status(201).json({ dietPlan: saved });
});

export const latestDietPlan = asyncHandler(async (req, res) => {
  let dietPlan;
  try {
    dietPlan = await prisma.dietPlan.findFirst({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    dietPlan = localStore.latestDietPlan(req.user!.id);
  }
  res.json({ dietPlan });
});

export const generateWorkoutPlan = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user!.id);
  const content = await safeAsk(
    "workout",
    profile,
    "Generate a complete personalized 7-day workout plan. Return only JSON with keys: title, schedule, precautions. schedule must contain exactly 7 unique objects with day, focus, workout, duration. Include specific exercises, sets/reps or time, intensity, warmup/cooldown, and health-aware precautions from the profile. Avoid generic repeated workouts."
  );

  const plan = normalizeWorkoutPlan(parseAiJson(content, {
    title: "Adaptive FOODFIT Workout",
    schedule: [],
    precautions: "Start gently and consult a professional for medical restrictions."
  }));

  const data = {
      userId: req.user!.id,
      title: String(plan.title ?? "FOODFIT Workout"),
      goal: profile?.goal ?? Goal.MAINTENANCE,
      precautions: String(plan.precautions ?? ""),
      plan
  };
  let saved;
  try {
    saved = await prisma.workoutPlan.create({ data });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    saved = localStore.addWorkoutPlan(req.user!.id, { id: `local-workout-${Date.now()}`, ...data, createdAt: new Date() });
  }

  res.status(201).json({ workoutPlan: saved });
});

export const latestWorkoutPlan = asyncHandler(async (req, res) => {
  let workoutPlan;
  try {
    workoutPlan = await prisma.workoutPlan.findFirst({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    workoutPlan = localStore.latestWorkoutPlan(req.user!.id);
  }
  res.json({ workoutPlan });
});

export const generateFoods = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user!.id);
  const content = await safeAsk(
    "foods",
    profile,
    "Recommend 9 specific healthy local foods for the user's city and profile. Return only JSON with keys: city, items. Each item must include name, macros, nutrients, benefits, suitability. Mention concrete dishes, portions, and disease/allergy suitability. Avoid generic repeated recommendations."
  );
  const foods = normalizeFoods(parseAiJson(content, { city: profile?.city ?? "Your city", items: [] }), profile);
  const data = {
      userId: req.user!.id,
      city: String(foods.city ?? profile?.city ?? "Your city"),
      items: foods.items ?? [],
      context: "AI generated local food recommendations"
  };
  let saved;
  try {
    saved = await prisma.foodRecommendation.create({ data });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    saved = localStore.addFoodRecommendation(req.user!.id, { id: `local-food-${Date.now()}`, ...data, createdAt: new Date() });
  }
  res.status(201).json({ foodRecommendation: saved });
});

export const latestFoods = asyncHandler(async (req, res) => {
  let foodRecommendation;
  try {
    foodRecommendation = await prisma.foodRecommendation.findFirst({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    foodRecommendation = localStore.latestFoodRecommendation(req.user!.id);
  }
  res.json({ foodRecommendation });
});

export const chat = asyncHandler(async (req, res) => {
  const { message } = chatSchema.parse(req.body);
  const profile = await getProfile(req.user!.id);
  try {
    await prisma.chatHistory.create({ data: { userId: req.user!.id, role: "user", content: message } });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    localStore.addChat(req.user!.id, "user", message);
  }
  const reply = await safeAsk("chat", profile, message, "A balanced FOODFIT answer: choose lean protein, high-fiber carbs, colorful vegetables, and adjust portions to your goal. For medical conditions, confirm major changes with a clinician.");
  try {
    await prisma.chatHistory.create({ data: { userId: req.user!.id, role: "assistant", content: reply } });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    localStore.addChat(req.user!.id, "assistant", reply);
  }
  res.json({ reply });
});

export const chatHistory = asyncHandler(async (req, res) => {
  let messages;
  try {
    messages = await prisma.chatHistory.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "asc" },
      take: 50
    });
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    messages = localStore.getChat(req.user!.id);
  }
  res.json({ messages });
});
