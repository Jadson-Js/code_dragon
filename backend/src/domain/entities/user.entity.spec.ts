import { describe, expect, it } from "@jest/globals";
import { User } from "./user.entity";

describe("User entity", () => {
  describe("create", () => {
    it("should create a User with all provided props", () => {
      const id = "user-1";
      const now = new Date("2024-01-01T00:00:00Z");
      const user = User.create({
        id,
        name: "John Doe",
        email: "john@example.com",
        passwordHash: "hashed-pw",
        verifiedAt: now,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      expect(user.id).toBe(id);
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
      expect(user.passwordHash).toBe("hashed-pw");
      expect(user.verifiedAt).toBe(now);
      expect(user.createdAt).toBe(now);
      expect(user.updatedAt).toBe(now);
      expect(user.deletedAt).toBeNull();
    });

    it("should generate a UUID when id is not provided", () => {
      const user = User.create({
        name: "Jane",
        email: "jane@example.com",
        passwordHash: "hash",
      });

      expect(user.id).toBeDefined();
      expect(user.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should default verifiedAt to null when not provided", () => {
      const user = User.create({
        name: "Jane",
        email: "jane@example.com",
        passwordHash: "hash",
      });
      expect(user.verifiedAt).toBeNull();
    });

    it("should default deletedAt to null when not provided", () => {
      const user = User.create({
        name: "Jane",
        email: "jane@example.com",
        passwordHash: "hash",
      });
      expect(user.deletedAt).toBeNull();
    });

    it("should default createdAt and updatedAt to current date when not provided", () => {
      const before = new Date();
      const user = User.create({
        name: "Jane",
        email: "jane@example.com",
        passwordHash: "hash",
      });
      const after = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe("isVerified", () => {
    it("should return true when verifiedAt is set", () => {
      const user = User.create({
        name: "John",
        email: "john@example.com",
        passwordHash: "hash",
        verifiedAt: new Date(),
      });
      expect(user.isVerified()).toBe(true);
    });

    it("should return false when verifiedAt is null", () => {
      const user = User.create({
        name: "John",
        email: "john@example.com",
        passwordHash: "hash",
        verifiedAt: null,
      });
      expect(user.isVerified()).toBe(false);
    });
  });

  describe("markAsVerified", () => {
    it("should return a new User with verifiedAt set", () => {
      const user = User.create({
        id: "user-1",
        name: "John",
        email: "john@example.com",
        passwordHash: "hash",
        verifiedAt: null,
      });

      const verified = user.markAsVerified();

      expect(verified).not.toBe(user);
      expect(verified.id).toBe("user-1");
      expect(verified.isVerified()).toBe(true);
      expect(verified.verifiedAt).toBeInstanceOf(Date);
    });
  });

  describe("changePassword", () => {
    it("should return a new User with the new passwordHash", () => {
      const user = User.create({
        id: "user-1",
        name: "John",
        email: "john@example.com",
        passwordHash: "old-hash",
        verifiedAt: new Date(),
      });

      const updated = user.changePassword("new-hash");

      expect(updated).not.toBe(user);
      expect(updated.id).toBe("user-1");
      expect(updated.passwordHash).toBe("new-hash");
    });
  });
});
