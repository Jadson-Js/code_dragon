import type { User } from "@/entities/user.entity";

export interface IResetPasswordRepository {
  execute(user: User, tokenId: string): Promise<void>;
}
