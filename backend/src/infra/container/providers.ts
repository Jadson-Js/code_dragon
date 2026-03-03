import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";
import { EmailProvider } from "@/infra/providers/email/email.provider";
import { JwtProvider } from "@/infra/providers/jwt.provider";
import { CreateUserWithEmailTokenPrismaRepository } from "@/infra/database/prisma/create-user-with-email-token.prisma.repository";
import { EmailQueueProvider } from "../providers/email/bullmq.provider";

container.registerSingleton("IHashProvider", HashProvider);
container.registerSingleton("IEmailProvider", EmailProvider);
container.registerSingleton("IJWTProvider", JwtProvider);
container.registerSingleton(
  "ICreateUserWithEmailTokenRepository",
  CreateUserWithEmailTokenPrismaRepository,
);
container.registerSingleton("IEmailQueueProvider", EmailQueueProvider);
