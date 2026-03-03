import { container } from "tsyringe";
import { AuthController } from "@/modules/auth/auth.controller";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { TokenPrismaRepository } from "@/infra/database/prisma/token.prisma.repository";
import { SignupUseCase } from "./use-cases/signup";
import { ResendVerificationUseCase } from "./use-cases/resend-verification";
import { VerifyEmailUseCase } from "./use-cases/verify-email";
import { ForgotPasswordUseCase } from "./use-cases/forgot-password";
import { ResetPasswordUseCase } from "./use-cases/reset-password";
import { LoginUseCase } from "./use-cases/login";

// Registra o repositório
container.register("UserRepository", {
  useClass: UserPrismaRepository,
});

container.register("TokenRepository", {
  useClass: TokenPrismaRepository,
});

// Registra os use cases
container.register("SignupUseCase", {
  useClass: SignupUseCase,
});

container.register("ResendVerificationUseCase", {
  useClass: ResendVerificationUseCase,
});

container.register("VerifyEmailUseCase", {
  useClass: VerifyEmailUseCase,
});

container.register("ForgotPasswordUseCase", {
  useClass: ForgotPasswordUseCase,
});

container.register("ResetPasswordUseCase", {
  useClass: ResetPasswordUseCase,
});

container.register("LoginUseCase", {
  useClass: LoginUseCase,
});

export const authController = container.resolve(AuthController);
