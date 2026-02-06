import type { Post } from "@/domain/entities/post.entity";

export interface IPostRepository {
  create(data: Post): Promise<Post>;
  update(data: Post): Promise<Post>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
}
