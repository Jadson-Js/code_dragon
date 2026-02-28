import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";

export default function AuthFooter() {
  return (
    <div>
      <div className="flex flex-row items-center gap-2 mb-8">
        <div className="flex-1 border-b-2 border-bg-3" />
        <span className="text-bg-3 typ-caption">OU</span>
        <div className="flex-1 border-b-2 border-bg-3" />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full gap-3 transition-all cursor-pointer mb-8"
      >
        <FcGoogle className="size-5" />
        Entrar com Google
      </Button>

      <div className="flex flex-row items-center justify-between mb-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row gap-1 items-center text-primary-1">
            <User className="" />
            <span className="font-bold">5K+</span>
          </div>
          <p className="text-white-2 typ-caption">Usuários ativos</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row gap-1 items-center text-primary-1">
            <User className="" />
            <span className="font-bold">5K+</span>
          </div>
          <p className="text-white-2 typ-caption">Usuários ativos</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row gap-1 items-center text-primary-1">
            <User className="" />
            <span className="font-bold">5K+</span>
          </div>
          <p className="text-white-2 typ-caption">Usuários ativos</p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2">
        <p className="text-center text-white-2 typ-caption">
          Ao se cadastrar, você concorda com os
          <Link to="/auth/login">
            <span className="link">Termos de Uso</span>
          </Link>
          e a
          <Link to="/auth/login">
            <span className="link">Política de Privacidade</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
