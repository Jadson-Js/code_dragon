import { User } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { CreateUserDTO } from "@/modules/user/user.dto";
import { ConflictError } from "@/shared/app.error";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("HashProvider") // Added EncryptService injection
    private readonly hashProvider: IHashProvider, // Added EncryptService injection
  ) {}

  async execute(params: CreateUserDTO) {
    const userWithSameEmail = await this.userRepository.findByEmail(
      params.email,
    );

    if (userWithSameEmail) {
      throw new ConflictError("User already exists");
    }

    const passwordHash = await this.hashProvider.hash(params.password); // Changed to use injected service

    const user = User.create({
      name: params.name,
      email: params.email,
      passwordHash,
    });

    const response = await this.userRepository.create(user);
    return response;
  }
}
