import type { Profile } from "@/entities/profile.entity";
import type { User } from "@/entities/user.entity";

export interface IGetMeRepository {
  execute(userId: string): Promise<{
    user: User;
    profile: Profile | null;
  } | null>;
}
