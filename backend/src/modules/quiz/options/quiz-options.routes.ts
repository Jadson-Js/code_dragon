import { Router } from "express";
import { quizOptionsController } from "./quiz-options.container";
import { simpleRateLimitMiddleware } from "@/infra/container/providers";

const router = Router();

router.get(
  "/",
  simpleRateLimitMiddleware.handle({ max: 50, windowInMs: 60000 }),
  quizOptionsController.handle.bind(quizOptionsController),
);

export { router as quizOptionsRoutes };
