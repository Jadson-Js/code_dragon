import type { IHashProvider } from "@/domain/providers/hash.provider";
import bcrypt from "bcrypt";
import { injectable } from "tsyringe";
const saltRounds = 10;

@injectable()
export class HashProvider implements IHashProvider {
  async hash(payload: string) {
    return await bcrypt.hash(payload, saltRounds);
  }

  async compare(payload: string, hash: string) {
    return await bcrypt.compare(payload, hash);
  }
}
