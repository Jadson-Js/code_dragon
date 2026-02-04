import { useState } from "react";
import { Link } from "react-router";
import { LuMail, LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputIcon } from "@/components/ui/input-icon";
import AuthFooterForm from "@/features/auth/components/AuthFooterForm";

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
      {/* Header */}
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-h1 text-white-1">Bem vindo de volta!</h1>
        <p className="text-white-2">Faça login para continuar</p>
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
            {/* Login Link */}
            <p className="text-end text-white-2 text-sm mb-6">
              <Link to="/forgot-password" className="link">
                Esqueceu sua senha?
              </Link>
            </p>
          </Field>
        </FieldGroup>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full uppercase tracking-wide"
        >
          Entrar
        </Button>
      </form>

      {/* Login Link */}
      <p className="text-center text-white-2 text-sm mb-6">
        Não tem uma conta?{" "}
        <Link to="/signup" className="link">
          Cadastre-se
        </Link>
      </p>

      <AuthFooterForm />
    </AuthLayout>
  );
}
