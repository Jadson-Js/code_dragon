import { describe, expect, it } from "@jest/globals";
import { User } from "@/domain/entities/user.entity";
import { Token } from "@/domain/entities/token.entity";
import { Profile } from "@/domain/entities/profile.entity";
import {
  profilePrismaToDomain,
  tokenPrismaToDomain,
  userPrismaToDomain,
} from "./mappers";

describe("Prisma mappers", () => {
  it("userPrismaToDomain should map prisma user to User entity", () => {
    const now = new Date();
    const rawUser = {
      id: "user-1",
      name: "admin",
      email: "admin@admin.com",
      passwordHash: "hash",
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const user = userPrismaToDomain(rawUser as never);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe("user-1");
    expect(user.email).toBe("admin@admin.com");
  });

  it("tokenPrismaToDomain should map prisma token to Token entity", () => {
    const now = new Date();
    const rawToken = {
      id: "token-1",
      userId: "user-1",
      tokenHash: "token-hash",
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(now.getTime() + 60_000),
      createdAt: now,
      updatedAt: now,
    };

    const token = tokenPrismaToDomain(rawToken as never);

    expect(token).toBeInstanceOf(Token);
    expect(token.id).toBe("token-1");
    expect(token.userId).toBe("user-1");
  });

  it("profilePrismaToDomain should map prisma profile to Profile entity", () => {
    const now = new Date();
    const rawProfile = {
      id: "profile-1",
      userId: "user-1",
      linkedinUrl: null,
      githubUrl: null,
      portfolioUrl: null,
      ageRangeId: 1,
      seniorityId: 2,
      specialtyId: 3,
      careerObjectiveId: 4,
      createdAt: now,
      updatedAt: now,
    };

    const profile = profilePrismaToDomain(rawProfile as never);

    expect(profile).toBeInstanceOf(Profile);
    expect(profile.id).toBe("profile-1");
    expect(profile.userId).toBe("user-1");
    expect(profile.seniorityId).toBe(2);
  });
});
