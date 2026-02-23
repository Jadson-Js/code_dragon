import { User } from "@/domain/entities/user.entity";
import type { IEmailProvider } from "@/domain/providers/email/email.provider";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { CreateUserDTO } from "@/modules/user/user.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,

    @inject("IEmailProvider")
    private readonly emailProvider: IEmailProvider,
  ) {}

  async execute(params: CreateUserDTO) {
    const user = User.create(params);
    const response = await this.userRepository.create(user);

    await this.emailProvider.send({
      to: "jadson20051965@gmail.com",
      subject: "Hello",
      template: "VERIFY_EMAIL",
      variables: {
        name: "Jadson",
        link: "google.com",
        expiration: "10 min",
      },
    });

    return response;
  }
}
