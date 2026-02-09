import type { User } from "@/domain/entities/user.entity";
import type { AuthResponseDTO } from "./auth.dto";

export function authToHTTP(entity: User): AuthResponseDTO {
  return {
    id: entity.id,
  };
}
