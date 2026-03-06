import { container } from "tsyringe";
import { UserSetupController } from "@/modules/user-setup/user-setup.controller";
import { CreateUserSetupWithSetupStacksPrismaRepository } from "@/infra/database/prisma/user-setup/create-user-setup-with-setup-stacks.repository";
import { CreateUserSetupUseCase } from "@/modules/user-setup/use-cases/create-user-setup";

// Registra o repositório
container.register("CreateUserSetupWithSetupStacksRepository", {
  useClass: CreateUserSetupWithSetupStacksPrismaRepository,
});

// Registra os use cases
container.register("CreateUserSetupUseCase", {
  useClass: CreateUserSetupUseCase,
});

export const userSetupController = container.resolve(UserSetupController);
