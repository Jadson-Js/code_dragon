import { Token } from "@/domain/entities/token.entity";
import type { ITokenRepository } from "@/domain/repositories/token.repository";
import type { CreateTokenDTO } from "@/modules/token/token.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateTokenUseCase {
  constructor(
    @inject("TokenRepository")
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(params: CreateTokenDTO & { id: string }) {
    const token = Token.create(params);
    const response = await this.tokenRepository.update(token);
    return response;
  }
}
