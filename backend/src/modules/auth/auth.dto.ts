export interface SignupDTO {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface ResendVerificationDTO {
  email: string;
}

export interface VerifyEmailDTO {
  token: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
