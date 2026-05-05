import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { InputWithIcons } from "@/components/ui/input";
import AuthLayout from "@/features/auth/layout/AuthLayout";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import AuthFooter from "@/features/auth/components/AuthFooter";
import { useLogin } from "@/features/auth/hooks/useLogin";
import PageHeader from "@/components/PageHeader";

export default function Login() {
  const { form, mutation } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <AuthLayout>
      <PageHeader
        title="Bem vindo de volta!"
        description="Continue sua jornada de aprendizado e evolução técnica"
        className="mb-8"
      />

      <form
        className="flex flex-col gap-4 mb-8"
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
      >
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputWithIcons
            id="email"
            leftIcon={Mail}
            placeholder="Digite seu email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field className="mb-8">
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <InputWithIcons
            id="password"
            placeholder="Digite sua senha"
            leftIcon={Lock}
            rightIcon={showPassword ? Eye : EyeOff}
            type={showPassword ? "text" : "password"}
            onRightIconClick={() => setShowPassword(!showPassword)}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
          <Link
            to="/auth/forgot-password"
            className="text-right link typ-caption"
          >
            Esqueceu sua senha?
          </Link>
        </Field>

        <Button
          variant="default"
          size="lg"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "ENTRANDO..." : "ENTRAR"}
        </Button>

        <Link to="/auth/signup">
          <p className="text-center text-white-2 typ-caption">
            Não tem uma conta? <span className="link">Crie uma conta</span>
          </p>
        </Link>
      </form>

      <AuthFooter />
    </AuthLayout>
  );
}
