import { container } from "tsyringe";
import { TokenController } from "@/modules/token/token.controller";
import { TokenPrismaRepository } from "@/infra/database/prisma/token.prisma.repository";
import { CreateTokenUseCase } from "@/modules/token/use-cases/create-token";
import { FindAllTokenUseCase } from "@/modules/token/use-cases/find-all-token";
import { FindByIdTokenUseCase } from "@/modules/token/use-cases/find-by-id-token";
import { UpdateTokenUseCase } from "@/modules/token/use-cases/update-token";
import { DeleteTokenUseCase } from "@/modules/token/use-cases/delete-token";

// Registra o repositório
container.register("TokenRepository", {
  useClass: TokenPrismaRepository,
});

// Registra os use cases
container.register("CreateTokenUseCase", {
  useClass: CreateTokenUseCase,
});

container.register("FindAllTokenUseCase", {
  useClass: FindAllTokenUseCase,
});

container.register("FindByIdTokenUseCase", {
  useClass: FindByIdTokenUseCase,
});

container.register("UpdateTokenUseCase", {
  useClass: UpdateTokenUseCase,
});

container.register("DeleteTokenUseCase", {
  useClass: DeleteTokenUseCase,
});

export const tokenController = container.resolve(TokenController);
