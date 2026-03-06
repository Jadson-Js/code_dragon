import type { UserSetup } from "@/domain/entities/user-setup.entity";
import type { UserSetupResponseDTO } from "./user-setup.dto";

export function userSetupToHTTP(entity: UserSetup): UserSetupResponseDTO {
  return {
    id: entity.id,
  };
}
