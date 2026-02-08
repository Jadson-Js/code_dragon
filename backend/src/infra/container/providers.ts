import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";
import { EmailProvider } from "@/infra/providers/email/email.provider";

container.registerSingleton("HashProvider", HashProvider);
container.registerSingleton("EmailProvider", EmailProvider);
