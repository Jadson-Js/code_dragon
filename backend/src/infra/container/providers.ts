import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";
import { EmailProvider } from "@/infra/providers/email/email.provider";
import { JwtProvider } from "@/infra/providers/jwt.provider";

container.registerSingleton("HashProvider", HashProvider);
container.registerSingleton("EmailProvider", EmailProvider);
container.registerSingleton("JWTProvider", JwtProvider);
