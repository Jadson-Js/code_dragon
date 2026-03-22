import { ZodError } from "zod";
import { describe, expect, it } from "@jest/globals";
import {
  forgotPasswordSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from "./auth.schema";

describe("Auth schemas", () => {
  it("loginSchema should accept valid payload", async () => {
    await expect(
      loginSchema.parseAsync({
        body: { email: "admin@admin.com", password: "12345678" },
      }),
    ).resolves.toBeDefined();
  });

  it("loginSchema should reject invalid payload", async () => {
    await expect(
      loginSchema.parseAsync({
        body: { email: "invalid-email", password: "123" },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("signupSchema should accept valid payload", async () => {
    await expect(
      signupSchema.parseAsync({
        body: {
          name: "admin",
          email: "admin@admin.com",
          password: "12345678",
        },
      }),
    ).resolves.toBeDefined();
  });

  it("signupSchema should reject invalid payload", async () => {
    await expect(
      signupSchema.parseAsync({
        body: {
          name: "M",
          email: "invalid-email",
          password: "123",
        },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("verifyEmailSchema should require token", async () => {
    await expect(
      verifyEmailSchema.parseAsync({
        body: { token: "" },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("resetPasswordSchema should require token and min password", async () => {
    await expect(
      resetPasswordSchema.parseAsync({
        body: { token: "", password: "123" },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("forgotPasswordSchema should require valid email", async () => {
    await expect(
      forgotPasswordSchema.parseAsync({
        body: { email: "invalid-email" },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("resendVerificationSchema should require valid email", async () => {
    await expect(
      resendVerificationSchema.parseAsync({
        body: { email: "invalid-email" },
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
