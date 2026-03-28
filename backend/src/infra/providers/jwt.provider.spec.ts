import "reflect-metadata";
import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { UnauthorizedError } from "@/shared/app.error";

const jwtMock = {
  sign: jest.fn<(payload: object, secret: string, options: object) => string>(),
  verify: jest.fn<(token: string, secret: string) => void>(),
  decode: jest.fn<(token: string) => { userId: string } | null>(),
};

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: jwtMock,
}));

let JwtProvider: {
  new (): {
    generateAccessToken(userId: string): Promise<string>;
    generateRefreshToken(userId: string): Promise<string>;
    generateEmailVerificationToken(userId: string): Promise<string>;
    generatePasswordResetToken(userId: string): Promise<string>;
    verifyAccessToken(token: string): Promise<boolean>;
    verifyRefreshToken(token: string): Promise<boolean>;
    verifyEmailVerificationToken(token: string): Promise<boolean>;
    verifyPasswordResetToken(token: string): Promise<boolean>;
    decodeToken(
      token: string,
    ): Promise<{ sub: string; [key: string]: unknown }>;
  };
};

describe("JwtProvider", () => {
  beforeAll(async () => {
    ({ JwtProvider } = await import("./jwt.provider"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate access token", async () => {
    jwtMock.sign.mockReturnValue("access-token");
    const provider = new JwtProvider();

    const token = await provider.generateAccessToken("user-1");

    expect(token).toBe("access-token");
    expect(jwtMock.sign).toHaveBeenCalledTimes(1);
  });

  it("should return false when verifyAccessToken throws", async () => {
    jwtMock.verify.mockImplementation(() => {
      throw new Error("invalid");
    });
    const provider = new JwtProvider();

    await expect(provider.verifyAccessToken("bad-token")).resolves.toBe(false);
  });

  it("should decode token to sub", async () => {
    jwtMock.decode.mockReturnValue({ userId: "user-1" });
    const provider = new JwtProvider();

    const decoded = await provider.decodeToken("token");

    expect(decoded.sub).toBe("user-1");
  });

  it("should throw UnauthorizedError for malformed token", async () => {
    jwtMock.decode.mockReturnValue(null);
    const provider = new JwtProvider();

    await expect(provider.decodeToken("bad")).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it("should generate all other token types", async () => {
    jwtMock.sign.mockReturnValue("some-token");
    const provider = new JwtProvider();

    await expect(provider.generateRefreshToken("u")).resolves.toBe("some-token");
    await expect(provider.generateEmailVerificationToken("u")).resolves.toBe(
      "some-token",
    );
    await expect(provider.generatePasswordResetToken("u")).resolves.toBe(
      "some-token",
    );
    expect(jwtMock.sign).toHaveBeenCalledTimes(3);
  });

  it("should verify all other token types successfully", async () => {
    jwtMock.verify.mockImplementation(() => {});
    const provider = new JwtProvider();

    await expect(provider.verifyAccessToken("t")).resolves.toBe(true);
    await expect(provider.verifyRefreshToken("t")).resolves.toBe(true);
    await expect(provider.verifyEmailVerificationToken("t")).resolves.toBe(true);
    await expect(provider.verifyPasswordResetToken("t")).resolves.toBe(true);
  });

  it("should return false when any verification fails", async () => {
    jwtMock.verify.mockImplementation(() => {
      throw new Error();
    });
    const provider = new JwtProvider();

    await expect(provider.verifyRefreshToken("t")).resolves.toBe(false);
    await expect(provider.verifyEmailVerificationToken("t")).resolves.toBe(
      false,
    );
    await expect(provider.verifyPasswordResetToken("t")).resolves.toBe(false);
  });
});
