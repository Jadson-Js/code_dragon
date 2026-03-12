import type { IGetSetupDTO } from "@/modules/profile/profile.dto";

export interface IGetSetupRepository {
  execute(): Promise<IGetSetupDTO>;
}
