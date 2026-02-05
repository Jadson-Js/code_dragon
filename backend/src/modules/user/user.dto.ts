export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface UserResponseDTO {
  name: string;
  email: string;
}
