import type { Profile } from "@/domain/entities/profile.entity";
import type { CreateProfileDTO } from "@/modules/profile/profile.dto";

export interface ICreateProfileWithStacksRepository {
  execute(params: CreateProfileDTO): Promise<Profile>;
}
