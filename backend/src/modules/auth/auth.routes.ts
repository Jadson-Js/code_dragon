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
  simpleRateLimitMiddleware,
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

router.get(
  "/me",
  simpleRateLimitMiddleware.handle({
    max: 10,
    windowInMs: 60000,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  authController.me.bind(authController),
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
  simpleRateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
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
  simpleRateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
  }),
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController),
);

router.post(
  "/login",
  simpleRateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
  }),
  validate(loginSchema),
  authController.login.bind(authController),
);

router.post(
  "/logout",
  simpleRateLimitMiddleware.handle({
    max: 6,
    windowInMs: 60000,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  authController.logout.bind(authController),
);

router.post(
  "/refresh",
  simpleRateLimitMiddleware.handle({
    max: 10,
    windowInMs: 60000,
  }),
  ensureAuthenticated.authRefresh.bind(ensureAuthenticated),
  authController.refreshToken.bind(authController),
);

export default router;
