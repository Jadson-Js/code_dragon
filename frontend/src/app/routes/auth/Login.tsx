import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { InputWithIcons } from "@/components/ui/input";
import AuthHeader from "@/features/auth/components/AuthHeader";
import AuthLayout from "@/features/auth/layout/AuthLayout";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import AuthFooter from "@/features/auth/components/AuthFooter";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function Login() {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <AuthLayout>
      <AuthHeader
        title="Bem vindo de volta!"
        description="Junte-se a milhares de devs acelerando a carreira"
        className="mb-8"
      />

      <form
        className="flex flex-col gap-4 mb-8"
        onSubmit={handleSubmit(onSubmit)}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "ENTRANDO..." : "ENTRAR"}
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
