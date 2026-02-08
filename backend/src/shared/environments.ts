export const EMAIL_TEMPLATES = {
  VERIFY_EMAIL: "VERIFY_EMAIL",
} as const;
export type IEMAIL_TEMPLATES =
  (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];
