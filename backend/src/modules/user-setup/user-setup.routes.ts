import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { rateLimitMiddleware } from "@/infra/http/middlewares/rate-limit.middleware";
import { createUserSetupSchema } from "./user-setup.schema";
import { userSetupController } from "./user-setup.container";
import { ensureAuthenticated } from "@/infra/container/providers";

const router = Router();

router.post(
  "/",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "create-user-setup",
  }),
  validate(createUserSetupSchema),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  userSetupController.create.bind(userSetupController),
);

export default router;
