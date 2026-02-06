import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { createUserSchema } from "./user.schema";
import { userController } from "./user.container";

const router = Router();

router.get(
  "/",
  userController.findAll.bind(userController),
);

router.get(
  "/:id",
  userController.findById.bind(userController),
);

router.post(
  "/",
  validate(createUserSchema),
  userController.create.bind(userController),
);

router.put(
  "/:id",
  userController.update.bind(userController),
);

router.delete(
  "/:id",
  userController.delete.bind(userController),
);

export default router;
