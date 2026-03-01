import AuthLayout from "@/features/auth/layout/AuthLayout";
import { Link } from "react-router";
import { ButtonWithIcons } from "@/components/ui/button";
import { ArrowLeft, Key, KeyRound, Mail, Send } from "lucide-react";
import AuthHeader from "@/features/auth/components/AuthHeader";
import ListNumber from "@/components/ui/listNumber";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputWithIcons } from "@/components/ui/input";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-24 h-24 rounded-full border border-primary-2/40 bg-primary-1/5 mb-4 m-auto">
        <KeyRound className="w-12 h-12 text-primary-1" strokeWidth={1.5} />
      </div>

      <AuthHeader
        title="Recuperar Senha"
        description={`Digite o e-mail associado à sua conta e enviaremos um link de recuperação.`}
        className="text-center mb-8"
      />

      <form className="w-full bg-bg-2 card mb-8 p-6 border border-bg-3">
        <Field className="mb-8">
          <FieldLabel className="typ-h3">E-mail</FieldLabel>
          <InputWithIcons
            type="email"
            placeholder="Seu e-mail"
            leftIcon={Mail}
          />
        </Field>

        <ButtonWithIcons
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          leftIcon={Send}
        >
          Enviar Link de Recuperação
        </ButtonWithIcons>
      </form>

      <div className="flex justify-center">
        <Link
          to="/login"
          className=" text-white-2 hover:text-white-1 flex flex-row items-center"
        >
          <ArrowLeft className="mr-1" strokeWidth={1.5} />
          Voltar para o login
        </Link>
      </div>
    </AuthLayout>
  );
}
