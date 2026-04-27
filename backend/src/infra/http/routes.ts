/**
 * Routes Index
 * Auto-generated file - DO NOT EDIT MANUALLY
 * This file is regenerated every time a new module is created.
 */

import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import profileRoutes from "@/modules/profile/profile.routes";
import quizQuestionsRoutes from "@/modules/quiz/questions/questions.routes";
import quizOptionsRoutes from "@/modules/quiz/options/quiz-options.routes";
import quizReportRoutes from "@/modules/quiz/report/report.routes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/profiles", profileRoutes);
router.use("/api/quiz/questions", quizQuestionsRoutes);
router.use("/api/quiz/options", quizOptionsRoutes);
router.use("/api/quiz/report", quizReportRoutes);

export default router;
