/**
 * Routes Index
 * Auto-generated file - DO NOT EDIT MANUALLY
 * This file is regenerated every time a new module is created.
 */

import { Router } from "express";
import postRoutes from "@/modules/post/post.routes";
import userRoutes from "@/modules/user/user.routes";

const router = Router();

router.use("/posts", postRoutes);
router.use("/users", userRoutes);

export default router;
