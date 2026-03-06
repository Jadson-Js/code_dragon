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
import {
  ensureAuthenticated,
  rateLimitMiddleware,
} from "@/infra/container/providers";

const router = Router();

router.post(
  "/signup",
  rateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
    key: "signup",
  }),
  validate(signupSchema),
  authController.signup.bind(authController),
);

router.post(
  "/resend-verification",
  rateLimitMiddleware.handle({
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
  rateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
    key: "verify-email",
  }),
  validate(verifyEmailSchema),
  authController.verifyEmail.bind(authController),
);

router.post(
  "/forgot-password",
  rateLimitMiddleware.handle({
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
  rateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
    key: "reset-password",
  }),
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController),
);

router.post(
  "/login",
  rateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
    key: "login",
    useEmail: true,
  }),
  validate(loginSchema),
  authController.login.bind(authController),
);

router.post(
  "/logout",
  rateLimitMiddleware.handle({
    max: 6,
    windowInMs: 60000,
    key: "logout",
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  authController.logout.bind(authController),
);

export default router;
