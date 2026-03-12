export interface ISignupInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface IResendVerificationInputDTO {
  email: string;
}

export interface IVerifyEmailInputDTO {
  token: string;
}

export interface IForgotPasswordInputDTO {
  email: string;
}

export interface IResetPasswordInputDTO {
  token: string;
  password: string;
}

export interface ILoginInputDTO {
  email: string;
  password: string;
}

export interface ILoginOutputDTO {
  id: string;
}

export interface ILogoutInputDTO {
  userId: string;
  refreshToken: string;
}

export interface IRefreshTokenInputDTO {
  userId: string;
  refreshToken: string;
}

export interface IGetMeOutputDTO {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  hasProfile: boolean;
}
