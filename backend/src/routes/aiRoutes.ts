import { Router } from "express";
import {
  chat,
  chatHistory,
  generateDietPlan,
  generateFoods,
  generateWorkoutPlan,
  latestDietPlan,
  latestFoods,
  latestWorkoutPlan
} from "../controllers/aiController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const aiRoutes = Router();

aiRoutes.use(requireAuth);
aiRoutes.post("/diet-plan/generate", generateDietPlan);
aiRoutes.get("/diet-plan/latest", latestDietPlan);
aiRoutes.post("/workout-plan/generate", generateWorkoutPlan);
aiRoutes.get("/workout-plan/latest", latestWorkoutPlan);
aiRoutes.post("/foods/generate", generateFoods);
aiRoutes.get("/foods/latest", latestFoods);
aiRoutes.get("/chat/history", chatHistory);
aiRoutes.post("/chat", chat);
