import { container } from "tsyringe";
import { AuthController } from "@/modules/auth/auth.controller";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { TokenPrismaRepository } from "@/infra/database/prisma/token.prisma.repository";
import { UserSetupViewPrismaRepository } from "@/infra/database/prisma/user-setup/user-setup-view.repository";
import { SignupUseCase } from "./use-cases/signup";
import { ResendVerificationUseCase } from "./use-cases/resend-verification";
import { VerifyEmailUseCase } from "./use-cases/verify-email";
import { ForgotPasswordUseCase } from "./use-cases/forgot-password";
import { ResetPasswordUseCase } from "./use-cases/reset-password";
import { LoginUseCase } from "./use-cases/login";
import { LogoutUseCase } from "./use-cases/logout";
import { RefreshTokenUseCase } from "./use-cases/refresh-token";
import { GetMeUseCase } from "./use-cases/get-me";

// Registra o repositório
container.register("UserRepository", {
  useClass: UserPrismaRepository,
});

container.register("TokenRepository", {
  useClass: TokenPrismaRepository,
});

container.register("IUserSetupViewRepository", {
  useClass: UserSetupViewPrismaRepository,
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

container.register("LogoutUseCase", {
  useClass: LogoutUseCase,
});

container.register("RefreshTokenUseCase", {
  useClass: RefreshTokenUseCase,
});

container.register("GetMeUseCase", {
  useClass: GetMeUseCase,
});

export const authController = container.resolve(AuthController);
