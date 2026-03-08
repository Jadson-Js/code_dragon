import type { Profile } from "@/domain/entities/profile.entity";
import type { User } from "@/domain/entities/user.entity";

export function authToHTTP(entity: User) {
  return {
    id: entity.id,
  };
}

export function getMeToHTTP(entity: { user: User; profile: Profile | null }) {
  return {
    id: entity.user.id,
    name: entity.user.name,
    email: entity.user.email,
    isVerified: entity.user.isVerified(),
    hasProfile: !!entity.profile,
  };
}
