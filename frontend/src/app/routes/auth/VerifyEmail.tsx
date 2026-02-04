import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { GrFormPreviousLink } from "react-icons/gr";
import { Link } from "react-router";
import { LuRefreshCcw } from "react-icons/lu";
import { useState } from "react";

export default function VerifyEmail() {
  const [textButton, setTextButton] = useState(
    "Não recebeu? Clique para reenviar",
  );
  const [iconButton, setIconButton] = useState<React.ReactNode | null>(
    <LuRefreshCcw size={14} />,
  );
  const [isDisable, setIsDisable] = useState(false);

  const handleResendEmail = async () => {
    setIsDisable(true);
    setTextButton("Reenviando em 5");
    setIconButton(null);
    regressiveContage(4);
  };

  const regressiveContage = (loop: number) => {
    if (loop === -1) {
      setIsDisable(false);
      setTextButton("Não recebeu? Clique para reenviar");
      setIconButton(<LuRefreshCcw size={14} />);
      return;
    }

    setTimeout(() => {
      setTextButton(`Reenviando em ${loop}`);
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
        disabled={isDisable}
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
