import type { IGetSetupOutputDTO } from "@/modules/profile/profile.dto";

export interface IGetSetupRepository {
  execute(): Promise<IGetSetupOutputDTO>;
}
