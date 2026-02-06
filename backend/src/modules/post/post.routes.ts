import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { createPostSchema } from "./post.schema";
import { postController } from "./post.container";

const router = Router();

router.post(
  "/",
  validate(createPostSchema),
  postController.create.bind(postController),
);

router.get(
  "/",
  postController.findAll.bind(postController),
);

router.get(
  "/:id",
  postController.findById.bind(postController),
);

router.put(
  "/:id",
  postController.update.bind(postController),
);

router.delete(
  "/:id",
  postController.delete.bind(postController),
);

export default router;
