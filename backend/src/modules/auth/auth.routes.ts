import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { authController } from "./auth.container";
import {
  signupSchema,
  resendVerificationSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema";
import { rateLimitMiddleware } from "@/infra/http/middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/signup",
  validate(signupSchema),
  authController.signup.bind(authController),
);

router.post(
  "/resend-verification",
  rateLimitMiddleware({
    max: 1,
    windowInMs: 60000,
    key: "resend-verification",
  }),
  validate(resendVerificationSchema),
  authController.resendVerification.bind(authController),
);

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  authController.verifyEmail.bind(authController),
);

router.post(
  "/forgot-password",
  rateLimitMiddleware({ max: 1, windowInMs: 60000, key: "forgot-password" }),
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController),
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController),
);

export default router;
