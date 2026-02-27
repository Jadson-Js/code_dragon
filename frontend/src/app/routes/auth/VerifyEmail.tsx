import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { GrFormPreviousLink } from "react-icons/gr";
import { Link, useParams } from "react-router";
import { LuRefreshCcw } from "react-icons/lu";
import { useContext, useEffect, useState } from "react";
import { TimerContext, type TimerContextType } from "@/app/TimerProvider";
import { useResendEmail } from "@/features/auth/hooks/use-resend-email";
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";

interface VerifyEmailProps {
  type: "signup" | "forgot-password";
}

export default function VerifyEmail({ type }: VerifyEmailProps) {
  const { mutate: resendEmail, isPending: isResendingSignup } =
    useResendEmail();
  const { mutate: forgotPassword, isPending: isResendingForgot } =
    useForgotPassword();

  const { email } = useParams();
  const timerContext = useContext<TimerContextType>(TimerContext);
  const [textButton, setTextButton] = useState(
    "Não recebeu? Clique para reenviar",
  );
  const [iconButton, setIconButton] = useState<React.ReactNode | null>(
    <LuRefreshCcw size={14} />,
  );

  const isPending = isResendingSignup || isResendingForgot;

  useEffect(() => {
    if (timerContext.timer > 0) {
      setTextButton(`Reenviar em ${timerContext.timer}s`);
      setIconButton(null);
    } else {
      setTextButton("Não recebeu? Clique para reenviar");
      setIconButton(<LuRefreshCcw size={14} />);
    }
  }, [timerContext.timer]);

  const handleResendEmail = async () => {
    if (type === "signup") {
      resendEmail({ email: email as string });
    } else {
      forgotPassword({ email: email as string });
    }

    timerContext.toggleTimer(60);
    regressiveContage(59);
  };

  const regressiveContage = (loop: number) => {
    if (loop < 0) {
      timerContext.toggleTimer(0);
      return;
    }

    setTimeout(() => {
      timerContext.toggleTimer(loop);
      regressiveContage(loop - 1);
    }, 1000);
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
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-h1 text-white-1 text-center">{title}</h1>
        <p className="text-white-2 text-center">{description}</p>
      </header>

      <Button
        variant="secondary"
        className="w-full mb-8"
        onClick={handleResendEmail}
        disabled={timerContext.timer !== 0}
        loading={isPending}
      >
        {iconButton} {textButton}
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
