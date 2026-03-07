import type { UserSetupView } from "@/domain/entities/user-setup-view";

export interface IUserSetupViewRepository {
  findByUserId(userId: string): Promise<UserSetupView | null>;
}
