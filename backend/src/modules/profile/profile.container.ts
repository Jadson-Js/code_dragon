import { container } from "tsyringe";
import { ProfileController } from "@/modules/profile/profile.controller";
import { RedisOnboardingOptionsRepository } from "@/infra/database/redis/redis-onboarding-options.repository";

// Repositórios compartilhados e específicos já são registrados em infra/container/providers.ts
// Registramos aqui apenas o que for exclusivo deste módulo e não estiver no container global

container.register("redisOnboardingOptionsRepository", {
  useClass: RedisOnboardingOptionsRepository,
});

// Os UseCases não precisam de registro explícito se forem usados como tokens de classe
// e não requerem ciclo de vida específico (como singleton).
// O tsyring os resolverá automaticamente.

export const profileController = container.resolve(ProfileController);
