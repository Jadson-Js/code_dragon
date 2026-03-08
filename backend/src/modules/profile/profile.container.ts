import { container } from "tsyringe";
import { ProfileController } from "@/modules/profile/profile.controller";
import { CreateProfileWithStacksPrismaRepository } from "@/infra/database/prisma/profile/create-profile-with-stacks.repository";
import { CreateProfileUseCase } from "@/modules/profile/use-cases/create-profile";

// Registra o repositório
container.register("ICreateProfileWithStacksRepository", {
  useClass: CreateProfileWithStacksPrismaRepository,
});

// Registra os use cases
container.register("CreateProfileUseCase", {
  useClass: CreateProfileUseCase,
});

export const profileController = container.resolve(ProfileController);
