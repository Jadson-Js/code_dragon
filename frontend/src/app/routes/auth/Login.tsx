import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuMail, LuLock, LuEye, LuEyeOff } from "react-icons/lu";

import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { InputIcon } from "@/components/ui/input-icon";
import AuthFooterForm from "@/features/auth/components/AuthFooterForm";
import AuthHeader from "@/features/auth/components/AuthHeader";

import { useLogin } from "@/features/auth/hooks/use-login";
import {
  loginSchema,
  type LoginValues,
} from "@/features/auth/schemas/login-schema";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginValues) => {
    login(data);
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Bem vindo de volta!"
        description="Faça login para continuar"
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 mb-6"
      >
        <FieldGroup>
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputIcon
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              iconLeft={<LuMail size={18} />}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          {/* Senha */}
          <Field>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <InputIcon
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              autoComplete="current-password"
              iconLeft={<LuLock size={18} />}
              iconRight={
                showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />
              }
              onIconRightClick={togglePasswordVisibility}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
            <div className="text-end mt-2">
              <Link
                to="/forgot-password"
                shaking-text
                className="link text-sm uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </Field>
        </FieldGroup>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full uppercase tracking-wide"
          loading={isPending}
        >
          Entrar
        </Button>
      </form>

      {/* Signup Link */}
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
