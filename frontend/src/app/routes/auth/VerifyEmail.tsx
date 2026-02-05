import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { GrFormPreviousLink } from "react-icons/gr";
import { Link } from "react-router";
import { LuRefreshCcw } from "react-icons/lu";
import { useContext, useEffect, useState } from "react";
import { TimerContext, type TimerContextType } from "@/app/TimerProvider";

export default function VerifyEmail() {
  const timerContext = useContext<TimerContextType>(TimerContext);
  const [textButton, setTextButton] = useState(
    "Não recebeu? Clique para reenviar",
  );
  const [iconButton, setIconButton] = useState<React.ReactNode | null>(
    <LuRefreshCcw size={14} />,
  );

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
    timerContext.toggleTimer(30);
    regressiveContage(29);
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

  return (
    <AuthLayout>
      <div className="w-20 h-20 mx-auto mb-8">
        <img src="/src/assets/IconEmail.svg" alt="icon" className="img" />
      </div>
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-h1 text-white-1 text-center">
          Verifique seu email
        </h1>
        <p className="text-white-2 text-center">
          Enviamos um link de confirmação para usuario@exemplo.comPara garantir
          a segurança da sua conta, por favor clique no link enviado antes de
          continuar.
        </p>
      </header>

      <Button
        variant="secondary"
        className="w-full mb-8"
        onClick={handleResendEmail}
        disabled={timerContext.timer !== 0}
      >
        {iconButton} {textButton}
      </Button>

      <div className="flex items-center justify-center">
        <Link
          to="/signup"
          className="text-white-2 text-caption flex items-center justify-center hover:text-white-1 transition-colors"
        >
          <GrFormPreviousLink size={20} /> Voltar para o cadastro
        </Link>
      </div>
    </AuthLayout>
  );
}
