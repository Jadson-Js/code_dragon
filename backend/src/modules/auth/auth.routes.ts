import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { authController } from "./auth.container";
import {
  signupSchema,
  resendVerificationSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
} from "./auth.schema";
import { rateLimitMiddleware } from "@/infra/http/middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/signup",
  rateLimitMiddleware({
    max: 5,
    windowInMs: 60000,
    key: "signup",
  }),
  validate(signupSchema),
  authController.signup.bind(authController),
);

router.post(
  "/resend-verification",
  rateLimitMiddleware({
    max: 5,
    windowInMs: 60000,
    key: "resend-verification",
    useEmail: true,
  }),
  validate(resendVerificationSchema),
  authController.resendVerification.bind(authController),
);

router.post(
  "/verify-email",
  rateLimitMiddleware({
    max: 5,
    windowInMs: 60000,
    key: "verify-email",
  }),
  validate(verifyEmailSchema),
  authController.verifyEmail.bind(authController),
);

router.post(
  "/forgot-password",
  rateLimitMiddleware({
    max: 5,
    windowInMs: 60000,
    key: "forgot-password",
    useEmail: true,
  }),
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController),
);

router.post(
  "/reset-password",
  rateLimitMiddleware({
    max: 5,
    windowInMs: 60000,
    key: "reset-password",
  }),
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController),
);

router.post(
  "/login",
  rateLimitMiddleware({
    max: 5,
    windowInMs: 60000,
    key: "login",
    useEmail: true,
  }),
  validate(loginSchema),
  authController.login.bind(authController),
);

export default router;
