import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputIcon } from "@/components/ui/input-icon";
import { LuMail } from "react-icons/lu";
import { Link } from "react-router";
import { GrFormPreviousLink } from "react-icons/gr";
import { FiSend } from "react-icons/fi";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <div className="w-16 h-16 mx-auto mb-8">
        <img src="/src/assets/IconKey.svg" alt="icon" className="img" />
      </div>

      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-h1 text-white-1">Recuperar Senha</h1>
        <p className="text-white-2">
          Digite o e-mail associado à sua conta e enviaremos um link de
          recuperação.
        </p>
      </header>

      <form className="flex flex-col gap-8 mb-8">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputIcon
              name="email"
              type="email"
              iconLeft={<LuMail size={18} />}
              autoComplete="email"
              placeholder="seu@email.com"
              required
            />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          className="w-full uppercase tracking-wide"
        >
          <FiSend size={18} /> Enviar Link de Recuperação
        </Button>
      </form>

      <div className="flex items-center justify-center">
        <Link
          to="/login"
          className="text-white-2 text-caption flex items-center justify-center hover:text-white-1 transition-colors"
        >
          <GrFormPreviousLink size={20} /> Voltar para o login
        </Link>
      </div>
    </AuthLayout>
  );
}
