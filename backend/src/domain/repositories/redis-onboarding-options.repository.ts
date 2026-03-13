import type { IGetOnboardingOptionsOutputDTO } from "@/modules/profile/profile.dto";

export interface IRedisOnboardingOptionsRepository {
  get(): Promise<IGetOnboardingOptionsOutputDTO | null>;
  set(value: IGetOnboardingOptionsOutputDTO): Promise<void>;
  exists(): Promise<boolean>;
}
