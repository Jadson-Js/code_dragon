import type { User } from "@/entities/user.entity";
import type { Token } from "@/entities/token.entity";

export interface ICreateUserWithEmailTokenRepository {
  execute(user: User, token: Token): Promise<User>;
}
