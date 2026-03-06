import { container } from "tsyringe";
import { UserSetupController } from "@/modules/user-setup/user-setup.controller";
import { UserSetupPrismaRepository } from "@/infra/database/prisma/user-setup.prisma.repository";
import { CreateUserSetupWithSetupStacksPrismaRepository } from "@/infra/database/prisma/user-setup/create-user-setup-with-setup-stacks.repository";
import { CreateUserSetupUseCase } from "@/modules/user-setup/use-cases/create-user-setup";
import { FindAllUserSetupUseCase } from "@/modules/user-setup/use-cases/find-all-user-setup";
import { FindByIdUserSetupUseCase } from "@/modules/user-setup/use-cases/find-by-id-user-setup";
import { UpdateUserSetupUseCase } from "@/modules/user-setup/use-cases/update-user-setup";
import { DeleteUserSetupUseCase } from "@/modules/user-setup/use-cases/delete-user-setup";

// Registra o repositório
container.register("UserSetupRepository", {
  useClass: UserSetupPrismaRepository,
});

container.register("CreateUserSetupWithSetupStacksRepository", {
  useClass: CreateUserSetupWithSetupStacksPrismaRepository,
});

// Registra os use cases
container.register("CreateUserSetupUseCase", {
  useClass: CreateUserSetupUseCase,
});

container.register("FindAllUserSetupUseCase", {
  useClass: FindAllUserSetupUseCase,
});

container.register("FindByIdUserSetupUseCase", {
  useClass: FindByIdUserSetupUseCase,
});

container.register("UpdateUserSetupUseCase", {
  useClass: UpdateUserSetupUseCase,
});

container.register("DeleteUserSetupUseCase", {
  useClass: DeleteUserSetupUseCase,
});

export const userSetupController = container.resolve(UserSetupController);
