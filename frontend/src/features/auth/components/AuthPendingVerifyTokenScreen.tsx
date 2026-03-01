import { Link } from "react-router";
import { SetupLayout } from "../layout/SetLayout";
import { ArrowLeft } from "lucide-react";

export default function AuthPendingVerifyTokenScreen() {
  return (
    <SetupLayout>
      {/* Animated spinner ring */}
      <div className="relative w-20 h-20 mb-12">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary-1/10 animate-ping" />
        {/* Spinning border */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-1 border-r-primary-1/40 animate-spin" />
        {/* Inner fill */}
        <div className="absolute inset-[6px] rounded-full bg-primary-1/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary-1 animate-pulse" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center mb-10">
        <h2 className="text-white-1 typ-h2 font-bold mb-2">
          Verificando seu e-mail
        </h2>
        <p className="text-white-2 typ-body max-w-xs">
          Aguarde um momento enquanto validamos o seu link de verificação...
        </p>
      </div>

      <div className="flex justify-center">
        <Link
          to="/signup"
          className=" text-white-2 hover:text-white-1 flex flex-row items-center"
        >
          <ArrowLeft className="mr-1" strokeWidth={1.5} />
          Voltar para o cadastro
        </Link>
      </div>
    </SetupLayout>
  );
}
