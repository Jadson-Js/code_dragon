import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { authController } from "./auth.container";
import {
  signupAuthSchema,
  resendEmailSchema,
  verifyEmailSchema,
} from "./auth.schema";

const router = Router();

router.post(
  "/signup",
  validate(signupAuthSchema),
  authController.signup.bind(authController),
);

router.post(
  "/resend-email",
  validate(resendEmailSchema),
  authController.resendEmail.bind(authController),
);

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  authController.verifyEmail.bind(authController),
);

export default router;
