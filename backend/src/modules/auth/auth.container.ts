import { container } from "tsyringe";
import { AuthController } from "@/modules/auth/auth.controller";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { TokenPrismaRepository } from "@/infra/database/prisma/token.prisma.repository";
import { GetMePrismaRepository } from "@/infra/database/prisma/auth/get-me.prisma.repository";

// Registra o repositório
container.register("IUserRepository", {
  useClass: UserPrismaRepository,
});

container.register("ITokenRepository", {
  useClass: TokenPrismaRepository,
});

container.register("IGetMeRepository", {
  useClass: GetMePrismaRepository,
});

// Os UseCases não precisam de registro explícito se forem usados como tokens de classe
// e não requerem ciclo de vida específico (como singleton).
// O tsyring os resolverá automaticamente.

export const authController = container.resolve(AuthController);
