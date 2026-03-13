import type { User } from "@/domain/entities/user.entity";
import type { Token } from "@/domain/entities/token.entity";

export interface ICreateUserWithEmailTokenRepository {
  execute(user: User, token: Token): Promise<User>;
}
