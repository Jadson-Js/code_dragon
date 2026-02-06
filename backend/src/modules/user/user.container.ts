import { container } from "tsyringe";
import { UserController } from "@/modules/user/user.controller";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { CreateUserUseCase } from "@/modules/user/use-cases/create-user";
import { FindAllUserUseCase } from "@/modules/user/use-cases/find-all-user";
import { FindByIdUserUseCase } from "@/modules/user/use-cases/find-by-id-user";
import { UpdateUserUseCase } from "@/modules/user/use-cases/update-user";
import { DeleteUserUseCase } from "@/modules/user/use-cases/delete-user";

// Registra o repositório
container.register("UserRepository", {
  useClass: UserPrismaRepository,
});

// Registra os use cases
container.register("CreateUserUseCase", {
  useClass: CreateUserUseCase,
});

container.register("FindAllUserUseCase", {
  useClass: FindAllUserUseCase,
});

container.register("FindByIdUserUseCase", {
  useClass: FindByIdUserUseCase,
});

container.register("UpdateUserUseCase", {
  useClass: UpdateUserUseCase,
});

container.register("DeleteUserUseCase", {
  useClass: DeleteUserUseCase,
});

export const userController = container.resolve(UserController);
