export interface CreateUserDTO {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UserResponseDTO {
  id: string;
}
