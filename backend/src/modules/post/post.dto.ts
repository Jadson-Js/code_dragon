export interface CreatePostDTO {
  name: string;
  email: string;
  passwordHash: string;
}

export interface PostResponseDTO {
  id: string;
}
