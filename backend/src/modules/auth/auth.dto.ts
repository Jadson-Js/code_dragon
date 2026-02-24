export interface SignupAuthDTO {
  name: string;
  email: string;
  password: string;
}

export interface ResendEmailDTO {
  email: string;
}

export interface AuthResponseDTO {
  id: string;
}

export interface ResendEmailResponseDTO {
  message: string;
}

export interface VerifyEmailDTO {
  token: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ForgotPasswordResponseDTO {
  message: string;
}
