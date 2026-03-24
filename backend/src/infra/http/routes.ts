/**
 * Routes Index
 * Auto-generated file - DO NOT EDIT MANUALLY
 * This file is regenerated every time a new module is created.
 */

import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import profileRoutes from "@/modules/profile/profile.routes";
import quizRoutes from "@/modules/quiz/quiz.routes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/profiles", profileRoutes);
router.use("/api/quiz", quizRoutes);

export default router;
