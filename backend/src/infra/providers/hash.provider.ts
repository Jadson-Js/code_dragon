import bcrypt from "bcrypt";
import { injectable } from "tsyringe";

export interface IHashProvider {
  hash(payload: string): Promise<string>;
  compare(payload: string, hash: string): Promise<boolean>;
}

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
