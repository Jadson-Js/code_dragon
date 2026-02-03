import { useState } from "react";
import { Link } from "react-router";
import {
  LuUser,
  LuCalendar,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuUsers,
  LuCode,
  LuRocket,
} from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";

import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { InputIcon } from "@/components/ui/input-icon";
import { InputMask } from "@/components/ui/input-mask";
import { StatItem, StatsGroup } from "@/components/ui/stats";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de cadastro
  };

  return (
    <AuthLayout>
      <div className="content py-8 w-full max-w-md m-auto">
        {/* Header */}
        <header className="flex flex-col gap-2 mb-8">
          <h1 className="text-h1 text-white-1">Bem vindo de volta!</h1>
          <p className="text-white-2">
            Faça login para continuar
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-6">
          <FieldGroup>
            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputIcon
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                required
                iconLeft={<LuMail size={18} />}
              />
            </Field>

            {/* Senha */}
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <InputIcon
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                required
                minLength={8}
                iconLeft={<LuLock size={18} />}
                iconRight={
                  showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />
                }
                onIconRightClick={togglePasswordVisibility}
              />
            </Field>
          </FieldGroup>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full uppercase tracking-wide">
            Entrar
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-white-2 text-sm mb-6">
          Não tem uma conta?{" "}
          <Link
            to="/signup"
            className="text-primary-1 hover:text-primary-2 font-medium underline underline-offset-4 transition-colors"
          >
            Cadastre-se
          </Link>
        </p>

        {/* Separator */}
        <FieldSeparator className="mb-6">OU</FieldSeparator>

        {/* Google Button */}
        <Button
          type="button"
          variant="social"
          size="lg"
          className="w-full mb-8"
        >
          <FcGoogle size={22} />
          <span>Continuar com Google</span>
        </Button>

        {/* Stats */}
        <StatsGroup className="mb-6">
          <StatItem icon={<LuUsers size={18} />} value="5K+" label="Usuários" />
          <StatItem icon={<LuCode size={18} />} value="50K+" label="Desafios" />
          <StatItem icon={<LuRocket size={18} />} value="100+" label="Cursos" />
        </StatsGroup>

        {/* Terms */}
        <footer className="text-center">
          <p className="text-white-2 text-xs leading-relaxed">
            Ao se inscrever você concorda com os{" "}
            <Link
              to="/terms"
              className="text-primary-1 hover:text-primary-2 underline underline-offset-2 transition-colors"
            >
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link
              to="/privacy"
              className="text-primary-1 hover:text-primary-2 underline underline-offset-2 transition-colors"
            >
              Políticas de Privacidade
            </Link>
          </p>
        </footer>
      </div>
    </AuthLayout>
  );
}
