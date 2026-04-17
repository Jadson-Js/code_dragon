import type { Token } from "@/entities/token.entity";

export interface ITokenRepository {
  create(data: Token): Promise<Token>;
  update(data: Token): Promise<Token>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Token | null>;
  findByUserId(userId: string): Promise<Token[]>;
  findAll(): Promise<Token[]>;
  deleteByUserIdAndCreateNewToken(userId: string, token: Token): Promise<void>;
}
