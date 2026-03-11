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
import { useCountdown } from "@/features/auth/hooks/useCountdown";
import PageHeader from "@/components/PageHeader";

const emailSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
});
type EmailFormData = z.infer<typeof emailSchema>;

export default function AuthVerifyEmailError() {
  const { mutation } = useResendVerification();
  const { countdown, start, isActive } = useCountdown(
    "verify-email-error-resend-cooldown",
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit: SubmitHandler<EmailFormData> = async ({ email }) => {
    await mutation.mutateAsync(email);
    start();
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
          leftIcon={mutation.isPending ? null : Send}
          disabled={isActive || mutation.isPending}
        >
          {mutation.isPending
            ? "Enviando..."
            : isActive
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
