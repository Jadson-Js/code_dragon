import { container } from "tsyringe";
import { AuthController } from "@/modules/auth/auth.controller";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { TokenPrismaRepository } from "@/infra/database/prisma/token.prisma.repository";
import { SignupAuthUseCase } from "./use-cases/signup-auth";
import { ResendEmailUseCase } from "./use-cases/resend-email";
import { VerifyEmailUseCase } from "./use-cases/verify-email";
import { ForgotPasswordUseCase } from "./use-cases/forgot-password";

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

container.register("ResendEmailUseCase", {
  useClass: ResendEmailUseCase,
});

container.register("VerifyEmailUseCase", {
  useClass: VerifyEmailUseCase,
});

container.register("ForgotPasswordUseCase", {
  useClass: ForgotPasswordUseCase,
});

export const authController = container.resolve(AuthController);
