import { describe, expect, it } from "@jest/globals";
import { User } from "./user.entity";

describe("User Entity", () => {
  it("should create a user with default values", () => {
    const user = User.create({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hashed_password",
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@example.com");
    expect(user.passwordHash).toBe("hashed_password");
    expect(user.verifiedAt).toBeNull();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.deletedAt).toBeNull();
  });

  it("should create a user with provided values", () => {
    const id = "fixed-id";
    const now = new Date();
    const user = User.create({
      id,
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hashed_password",
      verifiedAt: now,
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
    });

    expect(user.id).toBe(id);
    expect(user.verifiedAt).toBe(now);
    expect(user.createdAt).toBe(now);
    expect(user.updatedAt).toBe(now);
    expect(user.deletedAt).toBe(now);
  });

  it("should mark user as verified", () => {
    const user = User.create({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hashed_password",
    });

    const verifiedUser = user.markAsVerified();

    expect(verifiedUser.isVerified()).toBe(true);
    expect(verifiedUser.verifiedAt).toBeInstanceOf(Date);
    expect(verifiedUser.updatedAt).not.toBe(user.updatedAt);
  });

  it("should change user password", () => {
    const user = User.create({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "old_hash",
    });

    const updatedUser = user.changePassword("new_hash");

    expect(updatedUser.passwordHash).toBe("new_hash");
    expect(updatedUser.updatedAt).not.toBe(user.updatedAt);
  });

  it("should correctly report verification status", () => {
    const unverifiedUser = User.create({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hash",
    });
    expect(unverifiedUser.isVerified()).toBe(false);

    const verifiedUser = User.create({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hash",
      verifiedAt: new Date(),
    });
    expect(verifiedUser.isVerified()).toBe(true);
  });
});
