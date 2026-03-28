import { describe, expect, it } from "@jest/globals";
import { Token } from "./token.entity";

describe("Token entity", () => {
  describe("create", () => {
    it("should create a Token with all provided props", () => {
      const id = "token-1";
      const now = new Date("2024-01-01");
      const expiresAt = new Date(Date.now() + 60_000);

      const token = Token.create({
        id,
        userId: "user-1",
        tokenHash: "hash-abc",
        type: "EMAIL_VERIFICATION",
        expiresAt,
        createdAt: now,
        updatedAt: now,
      });

      expect(token.id).toBe(id);
      expect(token.userId).toBe("user-1");
      expect(token.tokenHash).toBe("hash-abc");
      expect(token.type).toBe("EMAIL_VERIFICATION");
      expect(token.expiresAt).toBe(expiresAt);
      expect(token.createdAt).toBe(now);
      expect(token.updatedAt).toBe(now);
    });

    it("should generate a UUID when id is not provided", () => {
      const token = Token.create({
        userId: "user-1",
        tokenHash: "hash",
        type: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 60_000),
      });

      expect(token.id).toBeDefined();
      expect(token.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should default createdAt and updatedAt to now when not provided", () => {
      const before = new Date();
      const token = Token.create({
        userId: "user-1",
        tokenHash: "hash",
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 60_000),
      });
      const after = new Date();

      expect(token.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(token.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(token.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(token.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe("isExpired", () => {
    it("should return false when the token has not yet expired", () => {
      const token = Token.create({
        userId: "user-1",
        tokenHash: "hash",
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 60_000),
      });

      expect(token.isExpired()).toBe(false);
    });

    it("should return true when the token is past its expiration date", () => {
      const token = Token.create({
        userId: "user-1",
        tokenHash: "hash",
        type: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() - 1000),
      });

      expect(token.isExpired()).toBe(true);
    });
  });
});
