import type { Profile } from "@/entities/profile.entity";

export interface IUpdateProfileWithStacksRepository {
  execute(params: { profile: Profile; stacksId: number[] }): Promise<Profile>;
}
