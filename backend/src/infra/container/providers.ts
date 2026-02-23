import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";
import { EmailProvider } from "@/infra/providers/email/email.provider";
import { JwtProvider } from "@/infra/providers/jwt.provider";
import { AuthTransactionPrismaRepository } from "@/infra/database/prisma/auth-transaction.prisma.repository";
import { EmailQueueProvider } from "../providers/email/bullmq.provider";

container.registerSingleton("IHashProvider", HashProvider);
container.registerSingleton("IEmailProvider", EmailProvider);
container.registerSingleton("IJWTProvider", JwtProvider);
container.registerSingleton(
  "AuthTransactionRepository",
  AuthTransactionPrismaRepository,
);
container.registerSingleton("IEmailQueueProvider", EmailQueueProvider);
