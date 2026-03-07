import type { Profile } from "@/domain/entities/profile.entity";

export interface IProfileRepository {
  findAll(): Promise<Profile[]>;
  findById(id: string): Promise<Profile | null>;
  findByUserId(userId: string): Promise<Profile | null>;
}
