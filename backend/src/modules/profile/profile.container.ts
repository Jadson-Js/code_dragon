import { container } from "tsyringe";
import { ProfileController } from "@/modules/profile/profile.controller";
import { CreateProfileUseCase } from "@/modules/profile/use-cases/create-profile";
import { GetOnboardingOptionsUseCase } from "./use-cases/get-onboarding-options";
import { GetProfileByUserIdUseCase } from "./use-cases/get-profile-by-user-id";
import { RedisOnboardingOptionsRepository } from "@/infra/database/redis/redis-onboarding-options.repository";

// Repositórios compartilhados e específicos já são registrados em infra/container/providers.ts
// Registramos aqui apenas o que for exclusivo deste módulo e não estiver no container global

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

container.register("GetProfileByUserIdUseCase", {
  useClass: GetProfileByUserIdUseCase,
});

export const profileController = container.resolve(ProfileController);
