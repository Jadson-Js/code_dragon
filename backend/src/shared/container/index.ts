import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";

container.registerSingleton("HashProvider", HashProvider);
