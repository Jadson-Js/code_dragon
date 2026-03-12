import type { Profile } from "@/domain/entities/profile.entity";
import type { ICreateProfileInputDTO } from "@/modules/profile/profile.dto";

export interface ICreateProfileWithStacksRepository {
  execute(params: ICreateProfileInputDTO): Promise<Profile>;
}
