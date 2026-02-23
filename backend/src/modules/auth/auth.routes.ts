import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { authController } from "./auth.container";
import {
  signupAuthSchema,
  resendEmailSchema,
  verifyEmailSchema,
} from "./auth.schema";
import { rateLimitMiddleware } from "@/infra/http/middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/signup",
  validate(signupAuthSchema),
  authController.signup.bind(authController),
);

router.post(
  "/resend-email",
  rateLimitMiddleware({ max: 1, windowInMs: 60000, key: "resend-email" }),
  validate(resendEmailSchema),
  authController.resendEmail.bind(authController),
);

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  authController.verifyEmail.bind(authController),
);

export default router;
