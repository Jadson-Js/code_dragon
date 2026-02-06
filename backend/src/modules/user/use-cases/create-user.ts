import { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { CreateUserDTO } from "@/modules/user/user.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: CreateUserDTO) {
    const user = User.create(params);

    const response = await this.userRepository.create(user);
    return response;
  }
}
