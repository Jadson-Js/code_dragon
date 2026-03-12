import { container } from "tsyringe";
import { ProfileController } from "@/modules/profile/profile.controller";
import { CreateProfileWithStacksPrismaRepository } from "@/infra/database/prisma/profile/create-profile-with-stacks.repository";
import { GetSetupPrismaRepository } from "@/infra/database/prisma/profile/get-setup.repository";
import { CreateProfileUseCase } from "@/modules/profile/use-cases/create-profile";
import { GetSetupUseCase } from "./use-cases/get-setup";
import { RedisProfileSetupRepository } from "@/infra/database/redis/redis-profile-setup.repository";

// Registra os repositórios
container.register("ICreateProfileWithStacksRepository", {
  useClass: CreateProfileWithStacksPrismaRepository,
});

container.register("getSetupRepository", {
  useClass: GetSetupPrismaRepository,
});

container.register("redisProfileSetupRepository", {
  useClass: RedisProfileSetupRepository,
});

// Registra os use cases
container.register("CreateProfileUseCase", {
  useClass: CreateProfileUseCase,
});

container.register("GetSetupUseCase", {
  useClass: GetSetupUseCase,
});

export const profileController = container.resolve(ProfileController);
