import type { IPostRepository } from "@/domain/repositories/post.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindByIdPostUseCase {
  constructor(
    @inject("PostRepository")
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(id: string) {
    return await this.postRepository.findById(id);
  }
}
