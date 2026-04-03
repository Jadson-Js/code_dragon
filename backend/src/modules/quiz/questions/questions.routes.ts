import { Router } from "express";
import { quizQuestionsController } from "./questions.container";
import {
  ensureAuthenticated,
  simpleRateLimitMiddleware,
} from "@/infra/container/providers";
import { quizQuestionGenerateSchema } from "./questions.schema";
import { validate } from "@/infra/http/middlewares/validate.middleware";

const router = Router();

router.post(
  "/generate",
  simpleRateLimitMiddleware.handle({
    max: 2,
    windowInMs: 60000,
  }),
  validate(quizQuestionGenerateSchema),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  quizQuestionsController.generateQuestions.bind(quizQuestionsController),
);

export default router;
