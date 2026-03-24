import { Router } from "express";
import questionsRoutes from "./questions/questions.routes";

const router = Router();

router.use("/questions", questionsRoutes);

export default router;
