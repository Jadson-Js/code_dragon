import { container } from "tsyringe";
import { UserSetupController } from "@/modules/user-setup/user-setup.controller";
import { CreateUserSetupUseCase } from "@/modules/user-setup/use-cases/create-user-setup";

// Registra os use cases
container.register("CreateUserSetupUseCase", {
  useClass: CreateUserSetupUseCase,
});

export const userSetupController = container.resolve(UserSetupController);
