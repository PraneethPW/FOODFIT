import type { HealthProfile } from "@prisma/client";

export const calculateBmi = (profile?: Pick<HealthProfile, "heightCm" | "weightKg"> | null) => {
  if (!profile?.heightCm || !profile.weightKg) return null;
  const meters = profile.heightCm / 100;
  return Number((profile.weightKg / (meters * meters)).toFixed(1));
};

export const estimateTargets = (profile?: HealthProfile | null) => {
  if (!profile?.heightCm || !profile.weightKg || !profile.age) {
    return { calories: 2100, protein: 110, carbs: 230, fat: 65, water: 2.7 };
  }

  const bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
  const calories = Math.round(bmr * 1.45);
  return {
    calories,
    protein: Math.round(profile.weightKg * 1.6),
    carbs: Math.round((calories * 0.45) / 4),
    fat: Math.round((calories * 0.25) / 9),
    water: Number(Math.max(2.2, profile.weightKg * 0.035).toFixed(1))
  };
};
