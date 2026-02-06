import type { IUserRepository } from "@/domain/repositories/user.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindAllUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute() {
    return await this.userRepository.findAll();
  }
}
