import { Router } from "express";
import {
  ensureAuthenticated,
  simpleRateLimitMiddleware,
} from "@/infra/container/providers";

import { validate } from "@/infra/middlewares/validate.middleware";
import {
  quizReportSubmitSchema,
  getQuizReportSchema,
} from "./report.schema";
import { quizReportController } from "./report.container";

const router = Router();

router.post(
  "/submit",
  simpleRateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
  }),
  validate(quizReportSubmitSchema),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  quizReportController.submit.bind(quizReportController),
);

router.get(
  "/session_quiz_id/:sessionQuizId",
  simpleRateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
  }),
  validate(getQuizReportSchema),
  quizReportController.getReport.bind(quizReportController),
);

router.get(
  "/latest",
  simpleRateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  quizReportController.getLatestReport.bind(quizReportController),
);

export default router;
