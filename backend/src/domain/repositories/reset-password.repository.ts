import type { User } from "@/domain/entities/user.entity";

export interface IResetPasswordRepository {
  execute(user: User, tokenId: string): Promise<void>;
}
