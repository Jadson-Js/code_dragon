import type { Token } from "@/domain/entities/token.entity";
import type { TokenResponseDTO } from "./token.dto";

export function tokenToHTTP(entity: Token): TokenResponseDTO {
  return {
    id: entity.id,
  };
}
