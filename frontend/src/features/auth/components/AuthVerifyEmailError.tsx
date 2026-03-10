import * as React from "react";
import { Link } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Mail, Send, ArrowLeft } from "lucide-react";
import { SetupLayout } from "../layout/SetLayout";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputWithIcons } from "@/components/ui/input";
import { ButtonWithIcons } from "@/components/ui/button";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import PageHeader from "@/components/PageHeader";

const STORAGE_KEY = "verify-email-error-resend-cooldown";

const emailSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
});
type EmailFormData = z.infer<typeof emailSchema>;

export default function AuthVerifyEmailError() {
  const { resendVerification, isResending } = useResendVerification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

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
  }, [countdown]);

  const onSubmit: SubmitHandler<EmailFormData> = async ({ email }) => {
    await resendVerification(email);
    const expiresAt = Date.now() + 60 * 1000;
    localStorage.setItem(STORAGE_KEY, expiresAt.toString());
    setCountdown(60);
  };

  return (
    <SetupLayout>
      {/* Error icon */}
      <div className="w-20 h-20 rounded-full border-2 border-red bg-red/10 flex items-center justify-center mb-12">
        <X className="w-12 h-12 text-red" />
      </div>

      <PageHeader
        title="Link Inválido ou Expirado"
        description="O link de verificação que você usou não é mais válido ou já expirou. Insira seu e-mail abaixo para receber um novo link."
        className="text-center mb-8 max-w-md"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-6 w-full max-w-md card bg-bg-2 mb-6"
      >
        <Field className="mb-6">
          <FieldLabel className="mb-2">E-mail</FieldLabel>
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
          leftIcon={isResending ? null : Send}
          disabled={countdown > 0 || isResending}
        >
          {isResending
            ? "Enviando..."
            : countdown > 0
              ? `Aguarde ${countdown}s para reenviar`
              : "Enviar novo link de verificação"}
        </ButtonWithIcons>
      </form>

      <div className="flex justify-center">
        <Link
          to="/auth/signup"
          className=" text-white-2 hover:text-white-1 flex flex-row items-center"
        >
          <ArrowLeft className="mr-1" strokeWidth={1.5} />
          Voltar para o cadastro
        </Link>
      </div>
    </SetupLayout>
  );
}
