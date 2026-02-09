import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";
import { EmailProvider } from "@/infra/providers/email/email.provider";
import { JwtProvider } from "@/infra/providers/jwt.provider";
import { AuthTransactionPrismaRepository } from "@/infra/database/prisma/auth-transaction.prisma.repository";

container.registerSingleton("HashProvider", HashProvider);
container.registerSingleton("EmailProvider", EmailProvider);
container.registerSingleton("JWTProvider", JwtProvider);
container.registerSingleton(
  "AuthTransactionRepository",
  AuthTransactionPrismaRepository,
);
