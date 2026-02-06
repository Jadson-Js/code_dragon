import { Post } from "@/domain/entities/post.entity";
import type { IPostRepository } from "@/domain/repositories/post.repository";
import type { CreatePostDTO } from "@/modules/post/post.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdatePostUseCase {
  constructor(
    @inject("PostRepository")
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(params: CreatePostDTO & { id: string }) {
    const post = Post.create(params);
    const response = await this.postRepository.update(post);
    return response;
  }
}
