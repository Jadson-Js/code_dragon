import { Router } from "express";
import { validate } from "@/infra/middlewares/validate.middleware";
import { feedbackController } from "./feedback.container";
import { createFeedbackSchema } from "./feedback.schema";
import {
  ensureAuthenticated,
  simpleRateLimitMiddleware,
} from "@/infra/container/providers";

const router = Router();

router.post(
  "/",
  simpleRateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  validate(createFeedbackSchema),
  feedbackController.create.bind(feedbackController)
);

export default router;
