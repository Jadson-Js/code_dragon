import type { Profile } from "@/domain/entities/profile.entity";

export interface IUpdateProfileWithStacksRepository {
  execute(params: { profile: Profile; stacksId: number[] }): Promise<Profile>;
}
