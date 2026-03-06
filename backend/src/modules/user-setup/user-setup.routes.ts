import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { rateLimitMiddleware } from "@/infra/http/middlewares/rate-limit.middleware";
import { createUserSetupSchema } from "./user-setup.schema";
import { userSetupController } from "./user-setup.container";
import { ensureAuthenticated } from "@/infra/container/providers";

const router = Router();

router.get(
  "/",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "find-all-user-setup",
    useEmail: false,
  }),
  userSetupController.findAll.bind(userSetupController),
);

router.get(
  "/:id",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "find-by-id-user-setup",
  }),
  userSetupController.findById.bind(userSetupController),
);

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

router.patch(
  "/:id",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "update-user-setup",
  }),
  userSetupController.update.bind(userSetupController),
);

router.delete(
  "/:id",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "delete-user-setup",
  }),
  userSetupController.delete.bind(userSetupController),
);

export default router;
