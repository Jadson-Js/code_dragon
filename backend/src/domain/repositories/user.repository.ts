import type { User } from "@/domain/entities/user.entity";

export interface IUserRepository {
  create(data: User): Promise<User>;
  update(data: User): Promise<User>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
