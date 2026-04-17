import { container } from "tsyringe";
import { AuthController } from "@/modules/auth/auth.controller";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { TokenPrismaRepository } from "@/infra/database/prisma/token.prisma.repository";
import { GetMePrismaRepository } from "@/infra/database/prisma/auth/get-me.prisma.repository";

// Registra o repositório como singleton usando a própria classe como token
container.registerSingleton(UserPrismaRepository);
container.registerSingleton(TokenPrismaRepository);
container.registerSingleton(GetMePrismaRepository);

// Os UseCases não precisam de registro explícito se forem usados como tokens de classe
// e não requerem ciclo de vida específico (como singleton).
// O tsyring os resolverá automaticamente.

export const authController = container.resolve(AuthController);
