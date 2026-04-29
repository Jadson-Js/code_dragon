import { Router } from "express";
import {
  ensureAuthenticated,
  simpleRateLimitMiddleware,
} from "@/infra/container/providers";

import { validate } from "@/infra/http/middlewares/validate.middleware";
import { quizReportSubmitSchema } from "./report.schema";
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

export default router;
