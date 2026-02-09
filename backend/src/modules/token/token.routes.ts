import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { createTokenSchema } from "./token.schema";
import { tokenController } from "./token.container";

const router = Router();

router.get(
  "/",
  tokenController.findAll.bind(tokenController),
);

router.get(
  "/:id",
  tokenController.findById.bind(tokenController),
);

router.post(
  "/",
  validate(createTokenSchema),
  tokenController.create.bind(tokenController),
);

router.put(
  "/:id",
  tokenController.update.bind(tokenController),
);

router.delete(
  "/:id",
  tokenController.delete.bind(tokenController),
);

export default router;
