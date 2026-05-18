import { Router } from "express";
import { addProgress, getProfile, getProgress, overview, upsertProfile } from "../controllers/profileController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const profileRoutes = Router();

profileRoutes.use(requireAuth);
profileRoutes.get("/overview", overview);
profileRoutes.get("/profile", getProfile);
profileRoutes.put("/profile", upsertProfile);
profileRoutes.get("/progress", getProgress);
profileRoutes.post("/progress", addProgress);
