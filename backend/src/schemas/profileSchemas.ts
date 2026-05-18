import { z } from "zod";

export const Gender = {
  FEMALE: "FEMALE",
  MALE: "MALE",
  NON_BINARY: "NON_BINARY",
  PREFER_NOT_TO_SAY: "PREFER_NOT_TO_SAY"
} as const;

export const FoodPreference = {
  VEGETARIAN: "VEGETARIAN",
  NON_VEGETARIAN: "NON_VEGETARIAN",
  VEGAN: "VEGAN",
  EGGETARIAN: "EGGETARIAN",
  JAIN: "JAIN"
} as const;

export const Goal = {
  WEIGHT_LOSS: "WEIGHT_LOSS",
  WEIGHT_GAIN: "WEIGHT_GAIN",
  MAINTENANCE: "MAINTENANCE",
  MUSCLE_GAIN: "MUSCLE_GAIN",
  ENDURANCE: "ENDURANCE"
} as const;

export const profileSchema = z.object({
  age: z.coerce.number().int().min(12).max(100).optional(),
  gender: z.nativeEnum(Gender).optional(),
  heightCm: z.coerce.number().min(80).max(260).optional(),
  weightKg: z.coerce.number().min(25).max(300).optional(),
  city: z.string().min(2).optional(),
  foodPreference: z.nativeEnum(FoodPreference).optional(),
  allergies: z.array(z.string()).default([]),
  diseases: z.array(z.string()).default([]),
  goal: z.nativeEnum(Goal).optional(),
  activityLevel: z.string().default("moderate")
});

export const progressSchema = z.object({
  weightKg: z.coerce.number().min(25).max(300).optional(),
  calories: z.coerce.number().int().min(0).optional(),
  proteinGrams: z.coerce.number().int().min(0).optional(),
  waterLiters: z.coerce.number().min(0).max(15).optional(),
  workoutMinutes: z.coerce.number().int().min(0).max(600).optional(),
  mood: z.string().optional()
});

export const chatSchema = z.object({
  message: z.string().min(2).max(1000)
});
