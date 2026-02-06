import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { createUserSchema } from "./user.schema";
import { userController } from "./user.container";

const router = Router();

router.post(
  "/",
  validate(createUserSchema),
  userController.create.bind(userController),
);

export default router;
