import type { HealthProfile } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FoodPreference, Gender, Goal } from "../schemas/profileSchemas.js";

type LocalUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  refreshTokenHash?: string | null;
  createdAt: Date;
};

type LocalProfile = HealthProfile;

type LocalProgress = {
  id: string;
  userId: string;
  date: Date;
  weightKg?: number | null;
  calories?: number | null;
  proteinGrams?: number | null;
  waterLiters?: number | null;
  workoutMinutes?: number | null;
  mood?: string | null;
};

const users = new Map<string, LocalUser>();
const profiles = new Map<string, LocalProfile>();
const dietPlans = new Map<string, any[]>();
const workoutPlans = new Map<string, any[]>();
const foodRecommendations = new Map<string, any[]>();
const progressEntries = new Map<string, LocalProgress[]>();
const chatEntries = new Map<string, any[]>();

const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const isMissingTableError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("does not exist in the current database") || message.includes("table `public.");
};

export const localStore = {
  async createUser(input: { name: string; email: string; password: string }) {
    const existing = [...users.values()].find((user) => user.email === input.email.toLowerCase());
    if (existing) return existing;
    const user: LocalUser = {
      id: id("local-user"),
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: await bcrypt.hash(input.password, 12),
      createdAt: new Date()
    };
    users.set(user.id, user);
    this.upsertProfile(user.id, {});
    return user;
  },

  async validateUser(email: string, password: string) {
    const user = [...users.values()].find((item) => item.email === email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
    return user;
  },

  updateRefreshToken(userId: string, refreshTokenHash: string | null) {
    const user = users.get(userId);
    if (user) user.refreshTokenHash = refreshTokenHash;
  },

  getUser(userId: string) {
    return users.get(userId) ?? null;
  },

  getProfile(userId: string) {
    return profiles.get(userId) ?? this.upsertProfile(userId, {});
  },

  upsertProfile(userId: string, data: Partial<LocalProfile>) {
    const current = profiles.get(userId);
    const now = new Date();
    const profile: LocalProfile = {
      id: current?.id ?? id("local-profile"),
      userId,
      age: data.age ?? current?.age ?? 24,
      gender: data.gender ?? current?.gender ?? Gender.MALE,
      heightCm: data.heightCm ?? current?.heightCm ?? 170,
      weightKg: data.weightKg ?? current?.weightKg ?? 78,
      city: data.city ?? current?.city ?? "Hyderabad",
      foodPreference: data.foodPreference ?? current?.foodPreference ?? FoodPreference.NON_VEGETARIAN,
      allergies: data.allergies ?? current?.allergies ?? [],
      diseases: data.diseases ?? current?.diseases ?? [],
      goal: data.goal ?? current?.goal ?? Goal.WEIGHT_LOSS,
      activityLevel: data.activityLevel ?? current?.activityLevel ?? "moderate",
      createdAt: current?.createdAt ?? now,
      updatedAt: now
    };
    profiles.set(userId, profile);
    return profile;
  },

  addProgress(userId: string, data: Omit<LocalProgress, "id" | "userId" | "date">) {
    const entry = { id: id("local-progress"), userId, date: new Date(), ...data };
    progressEntries.set(userId, [...(progressEntries.get(userId) ?? []), entry]);
    return entry;
  },

  getProgress(userId: string) {
    const entries = progressEntries.get(userId);
    if (entries?.length) return entries;
    return [
      { id: id("progress"), userId, date: new Date(Date.now() - 6 * 86400000), weightKg: 78, calories: 2100, proteinGrams: 112, waterLiters: 2.5, workoutMinutes: 35, mood: "steady" },
      { id: id("progress"), userId, date: new Date(Date.now() - 3 * 86400000), weightKg: 77.4, calories: 2050, proteinGrams: 126, waterLiters: 2.9, workoutMinutes: 45, mood: "good" },
      { id: id("progress"), userId, date: new Date(), weightKg: 76.9, calories: 2080, proteinGrams: 124, waterLiters: 3.1, workoutMinutes: 42, mood: "focused" }
    ];
  },

  addDietPlan(userId: string, plan: any) {
    dietPlans.set(userId, [plan, ...(dietPlans.get(userId) ?? [])]);
    return plan;
  },

  latestDietPlan(userId: string) {
    return dietPlans.get(userId)?.[0] ?? null;
  },

  addWorkoutPlan(userId: string, plan: any) {
    workoutPlans.set(userId, [plan, ...(workoutPlans.get(userId) ?? [])]);
    return plan;
  },

  latestWorkoutPlan(userId: string) {
    return workoutPlans.get(userId)?.[0] ?? null;
  },

  addFoodRecommendation(userId: string, recommendation: any) {
    foodRecommendations.set(userId, [recommendation, ...(foodRecommendations.get(userId) ?? [])]);
    return recommendation;
  },

  latestFoodRecommendation(userId: string) {
    return foodRecommendations.get(userId)?.[0] ?? null;
  },

  addChat(userId: string, role: string, content: string) {
    const message = { id: id("local-chat"), userId, role, content, createdAt: new Date() };
    chatEntries.set(userId, [...(chatEntries.get(userId) ?? []), message]);
    return message;
  },

  getChat(userId: string) {
    return chatEntries.get(userId) ?? [];
  }
};
