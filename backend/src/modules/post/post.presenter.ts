import type { Post } from "@/domain/entities/post.entity";
import type { PostResponseDTO } from "./post.dto";

export function postToHTTP(entity: Post): PostResponseDTO {
  return {
    id: entity.id,
  };
}
