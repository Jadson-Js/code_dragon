import type { Profile } from "@/domain/entities/profile.entity";
import type { User } from "@/domain/entities/user.entity";

export interface IGetMeRepository {
  execute(userId: string): Promise<{
    user: User;
    profile: Profile | null;
  } | null>;
}
