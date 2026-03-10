import React from "react";
import { SetupLayout } from "../layout/SetLayout";
import { ArrowLeft, Check } from "lucide-react";
import CircleCheck from "@/components/ui/circleCheck";
import { Link, useNavigate } from "react-router";
import PageHeader from "@/components/PageHeader";

export default function AuthVerifyEmailSuccess() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = React.useState(2);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const totalTime = 2;
    const interval = 100; // 100ms for smooth progress

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 100 / (totalTime * (1000 / interval));
      });
    }, interval);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, []);
  return (
    <SetupLayout>
      {/* Success Icon */}

      <div className="w-20 h-20 rounded-full border-2 border-green bg-green/15 flex items-center justify-center mb-12">
        <Check className="w-12 h-12 text-green" />
      </div>

      {/* Text Header */}
      <PageHeader
        title="E-mail verificado com sucesso!"
        description="Sua conta está segura e pronta para uso. Vamos configurar seu perfil agora."
        className="text-center mb-8"
      />

      <div className="bg-bg-2 p-4 card border border-bg-3 w-full max-w-md mb-8">
        <h3 className="text-white-1 typ-h3 mb-4">O que fazer agora:</h3>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <CircleCheck />

            <p className="text-white-2">
              Abra sua caixa de entrada e procure por um e-mail da
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <CircleCheck />
            <p className="text-white-2">
              Abra sua caixa de entrada e procure por um e-mail da
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <CircleCheck />
            <p className="text-white-2">
              Abra sua caixa de entrada e procure por um e-mail da
            </p>
          </div>
        </div>
      </div>

      {/* Redirect footer */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm mb-6">
        <p className="text-white-2 text-sm">
          Redirecionando automaticamente em{" "}
          <span className="font-bold">{seconds} Segundos</span>
        </p>
        <div className="w-[80%] h-1 bg-bg-3/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary-1 to-green transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
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
    </SetupLayout>
  );
}
