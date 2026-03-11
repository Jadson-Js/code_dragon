import AuthLayout from "@/features/auth/layout/AuthLayout";
import { Link } from "react-router";
import { ButtonWithIcons } from "@/components/ui/button";
import { ArrowLeft, KeyRound, Mail, Send } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputWithIcons } from "@/components/ui/input";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { useCountdown } from "@/features/auth/hooks/useCountdown";
import PageHeader from "@/components/PageHeader";

export default function ForgotPassword() {
  const { form, mutation } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const { countdown, start, isActive } = useCountdown(
    "forgot_password_countdown",
  );

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
    start();
  });

  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-24 h-24 rounded-full border border-primary-2/40 bg-primary-1/5 mb-4 m-auto">
        <KeyRound className="w-12 h-12 text-primary-1" strokeWidth={1.5} />
      </div>

      <PageHeader
        title="Recuperar Senha"
        description="Digite o e-mail associado à sua conta e enviaremos um link de recuperação."
        className="text-center mb-8"
      />

      <form
        className="w-full bg-bg-2 card mb-8 p-6 border border-bg-3"
        onSubmit={onSubmit}
      >
        <Field className="mb-8">
          <FieldLabel className="typ-h3">E-mail</FieldLabel>
          <InputWithIcons
            type="email"
            placeholder="Seu e-mail"
            leftIcon={Mail}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red text-xs mt-1">{errors.email.message}</p>
          )}
        </Field>

        <ButtonWithIcons
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          leftIcon={mutation.isPending ? null : Send}
          disabled={isActive || mutation.isPending}
        >
          {mutation.isPending
            ? "Enviando..."
            : isActive
              ? `Aguarde ${countdown}s para reenviar`
              : "Enviar Link de Recuperação"}
        </ButtonWithIcons>
      </form>

      <div className="flex justify-center">
        <Link
          to="/auth/login"
          className=" text-white-2 hover:text-white-1 flex flex-row items-center"
        >
          <ArrowLeft className="mr-1" strokeWidth={1.5} />
          Voltar para o login
        </Link>
      </div>
    </AuthLayout>
  );
}
