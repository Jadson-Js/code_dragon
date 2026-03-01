import AuthLayout from "@/features/auth/layout/AuthLayout";
import { Link } from "react-router";
import { ButtonWithIcons } from "@/components/ui/button";
import { ArrowLeft, KeyRound, Mail, Send } from "lucide-react";
import AuthHeader from "@/features/auth/components/AuthHeader";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputWithIcons } from "@/components/ui/input";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

export default function ForgotPassword() {
  const STORAGE_KEY = `forgot_password_countdown`;
  const { forgotPassword, isSending } = useForgotPassword();

  const [countdown, setCountdown] = React.useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return 0;

    const remaining = Math.ceil((parseInt(saved) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  });

  React.useEffect(() => {
    if (countdown <= 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          localStorage.removeItem(STORAGE_KEY);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, STORAGE_KEY]);

  const onSubmit: SubmitHandler<EmailFormData> = async ({ email }) => {
    if (!email) return;

    await forgotPassword(email);

    const expiresAt = Date.now() + 60 * 1000;
    localStorage.setItem(STORAGE_KEY, expiresAt.toString());
    setCountdown(60);
  };

  const emailSchema = z.object({
    email: z.email("Insira um e-mail válido"),
  });
  type EmailFormData = z.infer<typeof emailSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

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

      <form
        className="w-full bg-bg-2 card mb-8 p-6 border border-bg-3"
        onSubmit={handleSubmit(onSubmit)}
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
          leftIcon={isSending ? null : Send}
          disabled={countdown > 0 || isSending}
        >
          {isSending
            ? "Enviando..."
            : countdown > 0
              ? `Aguarde ${countdown}s para reenviar`
              : "Enviar Link de Recuperação"}
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
