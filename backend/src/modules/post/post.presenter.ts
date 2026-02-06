import { Post } from "@/domain/entities/post.entity";
import type { PostResponseDTO } from "./post.dto";

export function postToHTTP(post: Post): PostResponseDTO {
  return {
    id: post.id,
  };
}
