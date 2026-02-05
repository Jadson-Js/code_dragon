import { Router } from "express";
import { userController } from "@/infra/http/container/users";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { createUserSchema } from "./user.schema";

const router = Router();

router.post(
  "/",
  validate(createUserSchema),
  userController.create.bind(userController),
);

export default router;
