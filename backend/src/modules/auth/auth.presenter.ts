import type { User } from "@/domain/entities/user.entity";

export function authToHTTP(entity: User) {
  return {
    id: entity.id,
  };
}
