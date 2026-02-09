import { container } from "tsyringe";
import { AuthController } from "@/modules/auth/auth.controller";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { TokenPrismaRepository } from "@/infra/database/prisma/token.prisma.repository";
import { SignupAuthUseCase } from "./use-cases/signup-auth";

// Registra o repositório
container.register("UserRepository", {
  useClass: UserPrismaRepository,
});

container.register("TokenRepository", {
  useClass: TokenPrismaRepository,
});

// Registra os use cases
container.register("SignupAuthUseCase", {
  useClass: SignupAuthUseCase,
});

export const authController = container.resolve(AuthController);
