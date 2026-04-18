import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(8),
  }),
});

export type ISignupInputDTO = z.infer<typeof signupSchema>["body"];

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.email(),
  }),
});

export type IResendVerificationInputDTO = z.infer<
  typeof resendVerificationSchema
>["body"];

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});

export type IVerifyEmailInputDTO = z.infer<typeof verifyEmailSchema>["body"];

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email(),
  }),
});

export type IForgotPasswordInputDTO = z.infer<
  typeof forgotPasswordSchema
>["body"];

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8),
  }),
});

export type IResetPasswordInputDTO = z.infer<typeof resetPasswordSchema>["body"];

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

export type ILoginInputDTO = z.infer<typeof loginSchema>["body"];
