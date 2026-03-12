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
  "/setup",
  rateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
    key: "get-profile-setup",
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  profileController.getSetup.bind(profileController),
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
