import { container } from "tsyringe";

import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";
import { CreateUserUseCase } from "@/modules/user/use-cases/create-user";

// Registra o repositório (usado com @inject("UserRepository"))
container.register("UserRepository", {
  useClass: UserPrismaRepository,
});

// Registra o use case (usado com @inject("CreateUserUseCase"))
container.register("CreateUserUseCase", {
  useClass: CreateUserUseCase,
});

export { container };
