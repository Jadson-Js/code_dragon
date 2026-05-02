import { Router } from "express";
import { validate } from "@/infra/middlewares/validate.middleware";
import { createProfileSchema } from "./profile.schema";
import { profileController } from "./profile.container";
import {
  ensureAuthenticated,
  simpleRateLimitMiddleware,
} from "@/infra/container/providers";

const router = Router();

router.get(
  "/onboarding-options",
  simpleRateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  profileController.getOnboardingOptions.bind(profileController),
);

router.get(
  "/me",
  simpleRateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  profileController.getMe.bind(profileController),
);

router.post(
  "/",
  simpleRateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
  }),
  validate(createProfileSchema),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  profileController.create.bind(profileController),
);

export default router;
