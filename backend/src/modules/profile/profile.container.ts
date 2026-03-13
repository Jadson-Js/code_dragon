import { container } from "tsyringe";
import { ProfileController } from "@/modules/profile/profile.controller";
import { CreateProfileWithStacksPrismaRepository } from "@/infra/database/prisma/profile/create-profile-with-stacks.repository";
import { GetOnboardingOptionsPrismaRepository } from "@/infra/database/prisma/profile/get-onboarding-options.repository";
import { CreateProfileUseCase } from "@/modules/profile/use-cases/create-profile";
import { GetOnboardingOptionsUseCase } from "./use-cases/get-onboarding-options";
import { RedisOnboardingOptionsRepository } from "@/infra/database/redis/redis-onboarding-options.repository";

// Registra os repositórios
container.register("ICreateProfileWithStacksRepository", {
  useClass: CreateProfileWithStacksPrismaRepository,
});

container.register("getOnboardingOptionsRepository", {
  useClass: GetOnboardingOptionsPrismaRepository,
});

container.register("redisOnboardingOptionsRepository", {
  useClass: RedisOnboardingOptionsRepository,
});

// Registra os use cases
container.register("CreateProfileUseCase", {
  useClass: CreateProfileUseCase,
});

container.register("GetOnboardingOptionsUseCase", {
  useClass: GetOnboardingOptionsUseCase,
});

export const profileController = container.resolve(ProfileController);
