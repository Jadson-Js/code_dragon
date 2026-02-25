import type { IHashProvider } from "@/domain/providers/hash.provider";
import bcrypt from "bcrypt";
import { injectable } from "tsyringe";

@injectable()
export class HashProvider implements IHashProvider {
  private readonly SALTS_ROUNDS = 10;

  async hash(payload: string) {
    return await bcrypt.hash(payload, this.SALTS_ROUNDS);
  }

  async compare(payload: string, hash: string) {
    return await bcrypt.compare(payload, hash);
  }
}
