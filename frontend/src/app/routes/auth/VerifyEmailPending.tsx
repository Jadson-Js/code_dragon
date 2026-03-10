import AuthLayout from "@/features/auth/layout/AuthLayout";
import * as React from "react";
import { Link, useLocation } from "react-router";
import { ButtonWithIcons } from "@/components/ui/button";
import { ArrowLeft, Loader2, Mail, RefreshCcw } from "lucide-react";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import ListNumber from "@/components/ui/listNumber";
import PageHeader from "@/components/PageHeader";

export default function VerifyEmailPending() {
  const location = useLocation();
  const email = location.state?.email as string | undefined;
  const STORAGE_KEY = `resend_countdown_${email}`;
  const { resendVerification, isResending } = useResendVerification();

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

  const handleResend = async () => {
    if (!email) return;

    await resendVerification(email);

    const expiresAt = Date.now() + 60 * 1000;
    localStorage.setItem(STORAGE_KEY, expiresAt.toString());
    setCountdown(60);
  };

  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-24 h-24 rounded-full border border-primary-2/40 bg-primary-1/5 mb-4 m-auto">
        <Mail className="w-12 h-12 text-primary-1" strokeWidth={1.5} />
      </div>

      <PageHeader
        title="Verifique seu e-mail"
        description={`Enviamos um link de confirmação para ${email ?? "seu e-mail"}. Para garantir a segurança da sua conta, por favor clique no link enviado antes de continuar.`}
        className="text-center mb-12"
      />

      <ButtonWithIcons
        variant="secondary"
        size="lg"
        className="w-full mb-12"
        leftIcon={isResending ? Loader2 : countdown > 0 ? null : RefreshCcw}
        onClick={handleResend}
        disabled={countdown > 0 || isResending || !email}
      >
        {isResending
          ? "Enviando..."
          : countdown > 0
            ? `Aguarde ${countdown}s para reenviar`
            : "Não recebeu? Clique para reenviar"}
      </ButtonWithIcons>

      <div className="bg-bg-2 p-4 card border border-bg-3 mb-6">
        <h3 className="text-white-1 typ-h3 mb-4">O que fazer agora:</h3>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <ListNumber number={1} />
            <p className="text-white-2">
              Abra sua caixa de entrada e procure por um e-mail da{" "}
              <span className="font-bold">CodeDragon</span>
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <ListNumber number={2} />
            <p className="text-white-2">
              Abra sua caixa de entrada e procure por um e-mail da{" "}
              <span className="font-bold">CodeDragon</span>
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <ListNumber number={3} />
            <p className="text-white-2">
              Abra sua caixa de entrada e procure por um e-mail da{" "}
              <span className="font-bold">CodeDragon</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          to="/auth/signup"
          className=" text-white-2 hover:text-white-1 flex flex-row items-center"
        >
          <ArrowLeft className="mr-1" strokeWidth={1.5} />
          Voltar para o cadastro
        </Link>
      </div>
    </AuthLayout>
  );
}
