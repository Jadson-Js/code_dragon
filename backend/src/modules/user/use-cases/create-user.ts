import { hash } from "bcryptjs";
import { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { CreateUserDTO, UserResponseDTO } from "@/modules/user/user.dto";
import { inject, injectable } from "tsyringe";
@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: CreateUserDTO) {
    const passwordHash = await hash(params.password, 8);

    const user = User.create({
      name: params.name,
      email: params.email,
      passwordHash,
    });

    const response = await this.userRepository.create(user);
    return response;
  }
}
