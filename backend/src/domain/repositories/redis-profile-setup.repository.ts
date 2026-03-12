import type { IGetSetupOutputDTO } from "@/modules/profile/profile.dto";

export interface IRedisProfileSetupRepository {
  get(): Promise<IGetSetupOutputDTO | null>;
  set(value: IGetSetupOutputDTO): Promise<void>;
  exists(): Promise<boolean>;
}
