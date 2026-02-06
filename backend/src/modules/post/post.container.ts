import { container } from "tsyringe";
import { PostController } from "@/modules/post/post.controller";
import { PostPrismaRepository } from "@/infra/database/prisma/post.prisma.repository";
import { CreatePostUseCase } from "@/modules/post/use-cases/create-post";
import { FindAllPostUseCase } from "@/modules/post/use-cases/find-all-post";
import { FindByIdPostUseCase } from "@/modules/post/use-cases/find-by-id-post";
import { UpdatePostUseCase } from "@/modules/post/use-cases/update-post";
import { DeletePostUseCase } from "@/modules/post/use-cases/delete-post";

// Registra o repositório
container.register("PostRepository", {
  useClass: PostPrismaRepository,
});

// Registra os use cases
container.register("CreatePostUseCase", {
  useClass: CreatePostUseCase,
});

container.register("FindAllPostUseCase", {
  useClass: FindAllPostUseCase,
});

container.register("FindByIdPostUseCase", {
  useClass: FindByIdPostUseCase,
});

container.register("UpdatePostUseCase", {
  useClass: UpdatePostUseCase,
});

container.register("DeletePostUseCase", {
  useClass: DeletePostUseCase,
});

export const postController = container.resolve(PostController);
