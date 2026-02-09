/**
 * Routes Index
 * Auto-generated file - DO NOT EDIT MANUALLY
 * This file is regenerated every time a new module is created.
 */

import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import tokenRoutes from "@/modules/token/token.routes";
import userRoutes from "@/modules/user/user.routes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/tokens", tokenRoutes);
router.use("/api/users", userRoutes);

export default router;
