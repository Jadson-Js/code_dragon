import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import type {
  User as PrismaUser,
  Token as PrismaToken,
} from "../../../../generated/prisma/client";

export function userPrismaToDomain(raw: PrismaUser): User {
  return User.create({
    id: raw.id,
    name: raw.name,
    email: raw.email,
    passwordHash: raw.passwordHash,
    birthDate: raw.birthDate ?? null,
    verifiedAt: raw.verifiedAt ?? null,
    linkedinUrl: raw.linkedinUrl ?? null,
    githubUrl: raw.githubUrl ?? null,
    portfolioUrl: raw.portfolioUrl ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    deletedAt: raw.deletedAt ?? null,
  });
}

export function tokenPrismaToDomain(raw: PrismaToken): Token {
  return Token.create({
    id: raw.id,
    userId: raw.userId,
    tokenHash: raw.tokenHash,
    type: raw.type,
    expiresAt: raw.expiresAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
}
