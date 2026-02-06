import type { IUserRepository } from "@/domain/repositories/user.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindByIdUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    return await this.userRepository.findById(id);
  }
}
