import { Router } from "express";
import { quizQuestionsController } from "./questions.container";
import {
  ensureAuthenticated,
  simpleRateLimitMiddleware,
} from "@/infra/container/providers";
import {
  quizQuestionGenerateSchema,
  quizQuestionStreamSchema,
} from "./questions.schema";
import { validate } from "@/infra/middlewares/validate.middleware";

const router = Router();

router.post(
  "/generate",
  simpleRateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
  }),
  validate(quizQuestionGenerateSchema),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  quizQuestionsController.generateQuestions.bind(quizQuestionsController),
);

router.get(
  "/stream/:session_quiz_id",
  simpleRateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
  }),
  validate(quizQuestionStreamSchema),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  quizQuestionsController.streamQuestions.bind(quizQuestionsController),
);

export default router;
