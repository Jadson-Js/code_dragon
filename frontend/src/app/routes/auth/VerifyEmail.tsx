import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { GrFormPreviousLink } from "react-icons/gr";
import { Link, useParams } from "react-router";
import { LuRefreshCcw } from "react-icons/lu";
import { useContext } from "react";
import { TimerContext } from "@/app/TimerProvider";
import { useResendEmail } from "@/features/auth/hooks/use-resend-email";
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";
import AuthHeader from "@/features/auth/components/AuthHeader";

interface VerifyEmailProps {
  type: "signup" | "forgot-password";
}

export default function VerifyEmail({ type }: VerifyEmailProps) {
  const { mutate: resendEmail, isPending: isResendingSignup } =
    useResendEmail();
  const { mutate: forgotPassword, isPending: isResendingForgot } =
    useForgotPassword();

  const { email } = useParams();
  const { timer, startTimer } = useContext(TimerContext);

  const isPending = isResendingSignup || isResendingForgot;

  const handleResendEmail = () => {
    if (type === "signup") {
      resendEmail({ email: email as string });
    } else {
      forgotPassword({ email: email as string });
    }

    startTimer(60);
  };

  const title = type === "signup" ? "Verifique seu email" : "Recuperar senha";
  const description =
    type === "signup"
      ? `Enviamos um link de confirmação para ${email}. Para garantir a segurança da sua conta, por favor clique no link enviado antes de continuar.`
      : `Enviamos um link de recuperação para ${email}. Clique no link enviado para redefinir sua senha.`;

  return (
    <AuthLayout>
      <div className="w-20 h-20 mx-auto mb-8">
        <img src="/src/assets/IconEmail.svg" alt="icon" className="img" />
      </div>
      <AuthHeader title={title} description={description} centered />

      <Button
        variant="secondary"
        className="w-full mb-8"
        onClick={handleResendEmail}
        disabled={timer !== 0}
        loading={isPending}
      >
        {timer > 0 ? (
          `Reenviar em ${timer}s`
        ) : (
          <>
            <LuRefreshCcw size={14} className="mr-2" />
            Não recebeu? Clique para reenviar
          </>
        )}
      </Button>

      <div className="flex items-center justify-center">
        <Link
          to={type === "signup" ? "/signup" : "/forgot-password"}
          className="text-white-2 text-caption flex items-center justify-center hover:text-white-1 transition-colors"
        >
          <GrFormPreviousLink size={20} /> Voltar para o{" "}
          {type === "signup" ? "cadastro" : "recuperar senha"}
        </Link>
      </div>
    </AuthLayout>
  );
}
