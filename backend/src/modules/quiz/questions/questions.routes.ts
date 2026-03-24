import { Router } from "express";
import { questionsController } from "./questions.container";
import {
  ensureAuthenticated,
  simpleRateLimitMiddleware,
} from "@/infra/container/providers";

const router = Router();

router.post(
  "/generate",
  simpleRateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  questionsController.generateQuestions.bind(questionsController),
);

export default router;
