import type { IHashProvider } from "@/domain/providers/hash.provider";
import bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { env } from "@/shared/env";

@injectable()
export class HashProvider implements IHashProvider {
  async hash(payload: string) {
    return await bcrypt.hash(payload, env.bcryptSaltRounds);
  }

  async compare(payload: string, hash: string) {
    return await bcrypt.compare(payload, hash);
  }
}
