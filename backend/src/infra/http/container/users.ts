import "./index"; // Registra as dependências primeiro
import { container } from "tsyringe";
import { UserController } from "@/modules/user/user.controller";

export const userController = container.resolve(UserController);
