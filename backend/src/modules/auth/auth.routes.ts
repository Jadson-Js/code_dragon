import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { authController } from "./auth.container";
import { signupAuthSchema } from "./auth.schema";

const router = Router();

router.post(
  "/signup",
  validate(signupAuthSchema),
  authController.signup.bind(authController),
);

export default router;
