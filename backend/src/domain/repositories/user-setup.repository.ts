import type { UserSetup } from "@/domain/entities/user-setup.entity";

export interface IUserSetupRepository {
  delete(id: string): Promise<void>;
  findById(id: string): Promise<UserSetup | null>;
  findAll(): Promise<UserSetup[]>;
}
