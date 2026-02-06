import { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { CreateUserDTO } from "@/modules/user/user.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: CreateUserDTO & { id: string }) {
    const user = User.create(params);
    const response = await this.userRepository.update(user);
    return response;
  }
}
