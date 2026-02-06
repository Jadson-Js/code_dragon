import { User } from "@/domain/entities/user.entity";
import type { UserResponseDTO } from "./user.dto";

export function userToHTTP(user: User): UserResponseDTO {
  return {
    name: user.name,
    email: user.email,
  };
}
