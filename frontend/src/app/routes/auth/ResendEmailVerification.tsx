import AuthLayout from "@/features/auth/components/AuthLayout";

import { useParams } from "react-router";
import { ButtonWithIcons } from "@/components/ui/button";
import { Mail, RefreshCcw } from "lucide-react";
import AuthHeader from "@/features/auth/components/AuthHeader";

export default function ResendEmailVerification() {
  const { email } = useParams();

  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-24 h-24 rounded-full border border-primary-2/40 bg-primary-1/5 mb-4 m-auto">
        <Mail className="w-12 h-12 text-primary-1" strokeWidth={1.5} />
      </div>

      <AuthHeader
        title="Verifique seu e-mail"
        description={`Enviamos um link de confirmação para ${email}. Para garantir a segurança da sua conta, por favor clique no link enviado antes de continuar.`}
        className="text-center mb-12"
      />

      <ButtonWithIcons
        variant="secondary"
        size="lg"
        className="w-full mb-12"
        leftIcon={RefreshCcw}
      >
        Não recebeu? Clique para reenviar
      </ButtonWithIcons>

      <div className="bg-bg-2 p-4 card border border-bg-3">
        <h3 className="text-white-1 typ-h3 mb-4">O que fazer agora:</h3>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="shrink-0 w-6 h-6 rounded-full bg-primary-1 flex items-center justify-center text-white-1 font-bold text-sm">
              1
            </div>
            <p className="text-white-2">
              Abra sua caixa de entrada e procure por um e-mail da{" "}
              <span className="font-bold">CodeDragon</span>
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="shrink-0 w-6 h-6 rounded-full bg-primary-1 flex items-center justify-center text-white-1 font-bold text-sm">
              2
            </div>
            <p className="text-white-2">
              Abra sua caixa de entrada e procure por um e-mail da{" "}
              <span className="font-bold">CodeDragon</span>
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="shrink-0 w-6 h-6 rounded-full bg-primary-1 flex items-center justify-center text-white-1 font-bold text-sm">
              3
            </div>
            <p className="text-white-2">
              Abra sua caixa de entrada e procure por um e-mail da{" "}
              <span className="font-bold">CodeDragon</span>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
