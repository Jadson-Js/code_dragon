import type { IGetSetupDTO } from "@/modules/profile/profile.dto";

export interface IRedisProfileSetupRepository {
  get(): Promise<IGetSetupDTO | null>;
  set(value: IGetSetupDTO): Promise<void>;
  exists(): Promise<boolean>;
}
