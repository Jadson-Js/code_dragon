import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { createProfileSchema } from "./profile.schema";
import { profileController } from "./profile.container";
import {
  ensureAuthenticated,
  rateLimitMiddleware,
} from "@/infra/container/providers";

const router = Router();

router.get(
  "/onboarding-options",
  rateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
    key: "get-profile-onboarding-options",
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  profileController.getOnboardingOptions.bind(profileController),
);

router.post(
  "/",
  rateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
    key: "create-profile",
  }),
  validate(createProfileSchema),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  profileController.create.bind(profileController),
);

export default router;
