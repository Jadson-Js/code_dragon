export interface SignupDTO {
  name: string;
  email: string;
  password: string;
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

export interface LogoutDTO {
  userId: string;
  refreshToken: string;
}

export interface RefreshTokenDTO {
  userId: string;
  refreshToken: string;
}
