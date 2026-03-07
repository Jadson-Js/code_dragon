import type { Profile } from "@/domain/entities/profile.entity";
import type { ProfileResponseDTO } from "./profile.dto";

export function profileToHTTP(entity: Profile): ProfileResponseDTO {
  return {
    id: entity.id,
  };
}
