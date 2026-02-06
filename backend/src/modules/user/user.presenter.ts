import type { User } from "@/domain/entities/user.entity";
import type { UserResponseDTO } from "./user.dto";

export function userToHTTP(entity: User): UserResponseDTO {
  return {
    id: entity.id,
  };
}
