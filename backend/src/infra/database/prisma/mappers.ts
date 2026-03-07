import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import type {
  User as PrismaUser,
  Token as PrismaToken,
  UserSetup as PrismaUserSetup,
  UserSetupView as PrismaUserSetupView,
} from "../../../../generated/prisma/client";
import { UserSetup } from "@/domain/entities/user-setup.entity";
import { UserSetupView } from "@/domain/entities/user-setup-view";

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

export function userSetupPrismaToDomain(raw: PrismaUserSetup): UserSetup {
  return UserSetup.create({
    id: raw.id,
    userId: raw.userId,
    seniorityId: raw.seniorityId,
    specialityId: raw.specialityId,
    careerObjectiveId: raw.careerObjectiveId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
}

export function userSetupViewPrismaToDomain(
  raw: PrismaUserSetupView,
): UserSetupView {
  return UserSetupView.create({
    userId: raw.userId,
    userName: raw.userName,
    userSetupId: raw.userSetupId ?? null,
    seniorityName: raw.seniorityName ?? null,
    specialityName: raw.specialityName ?? null,
    careerObjectiveName: raw.careerObjectiveName ?? null,
    stackNames: raw.stackNames,
  });
}
