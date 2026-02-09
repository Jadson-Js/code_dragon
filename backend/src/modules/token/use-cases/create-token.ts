import { Token } from "@/domain/entities/token.entity";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import type { CreateTokenDTO } from "@/modules/token/token.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateTokenUseCase {
  constructor(
    @inject("TokenRepository")
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(params: CreateTokenDTO) {
    const token = Token.create(params);
    const response = await this.tokenRepository.create(token);
    return response;
  }
}
