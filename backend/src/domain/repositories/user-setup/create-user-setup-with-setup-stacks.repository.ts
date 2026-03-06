import type { UserSetup } from "@/domain/entities/user-setup.entity";
import type { CreateUserSetupDTO } from "@/modules/user-setup/user-setup.dto";

export interface ICreateUserSetupWithSetupStacksRepository {
  execute(params: CreateUserSetupDTO): Promise<UserSetup>;
}
