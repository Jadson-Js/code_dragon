/**
 * Routes Index
 * Auto-generated file - DO NOT EDIT MANUALLY
 * This file is regenerated every time a new module is created.
 */

import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import userSetupRoutes from "@/modules/user-setup/user-setup.routes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/user-setups", userSetupRoutes);

export default router;
