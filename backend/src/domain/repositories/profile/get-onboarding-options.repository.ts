import type { IGetOnboardingOptionsOutputDTO } from "@/modules/profile/profile.dto";

export interface IGetOnboardingOptionsRepository {
  execute(): Promise<IGetOnboardingOptionsOutputDTO>;
}
