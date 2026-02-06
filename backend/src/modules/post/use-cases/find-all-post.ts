import type { IPostRepository } from "@/domain/repositories/post.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindAllPostUseCase {
  constructor(
    @inject("PostRepository")
    private readonly postRepository: IPostRepository,
  ) {}

  async execute() {
    return await this.postRepository.findAll();
  }
}
