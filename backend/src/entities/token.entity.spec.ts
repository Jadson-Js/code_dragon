import { describe, expect, it } from "@jest/globals";
import { Token } from "./token.entity";
import { TokenType } from "generated/prisma/enums";

describe("Token Entity", () => {
  it("should create a token with default values", () => {
    const expiresAt = new Date(Date.now() + 3600000);
    const token = Token.create({
      userId: "user-1",
      tokenHash: "hash",
      type: TokenType.EMAIL_VERIFICATION,
      expiresAt,
    });

    expect(token.id).toBeDefined();
    expect(token.userId).toBe("user-1");
    expect(token.tokenHash).toBe("hash");
    expect(token.type).toBe(TokenType.EMAIL_VERIFICATION);
    expect(token.expiresAt).toBe(expiresAt);
    expect(token.createdAt).toBeInstanceOf(Date);
    expect(token.updatedAt).toBeInstanceOf(Date);
  });

  it("should check if token is expired", () => {
    const past = new Date(Date.now() - 1000);
    const future = new Date(Date.now() + 3600000);

    const expiredToken = Token.create({
      userId: "user-1",
      tokenHash: "hash",
      type: TokenType.EMAIL_VERIFICATION,
      expiresAt: past,
    });

    const validToken = Token.create({
      userId: "user-1",
      tokenHash: "hash",
      type: TokenType.EMAIL_VERIFICATION,
      expiresAt: future,
    });

    expect(expiredToken.isExpired()).toBe(true);
    expect(validToken.isExpired()).toBe(false);
  });
});
