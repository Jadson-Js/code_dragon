import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { authController } from "./auth.container";
import { signupAuthSchema, resendEmailSchema } from "./auth.schema";

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

export default router;
