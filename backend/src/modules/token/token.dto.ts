export interface CreateTokenDTO {
  userId: string;
  token: string;
  type: string;
  expiresAt: Date;
  user: string;
}

export interface TokenResponseDTO {
  id: string;
}
