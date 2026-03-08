import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input, InputMask, InputWithIcons } from "@/components/ui/input";
import AuthHeader from "@/features/auth/components/AuthHeader";
import AuthLayout from "@/features/auth/layout/AuthLayout";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import AuthFooter from "@/features/auth/components/AuthFooter";
import { useSignup } from "@/features/auth/hooks/useSignup";

export default function Signup() {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useSignup();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <AuthLayout>
      <AuthHeader
        title="Crie sua conta gratuita"
        description="Junte-se a milhares de devs acelerando a carreira"
        className="mb-8"
      />

      <form
        className="flex flex-col gap-4 mb-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Field>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input
            id="name"
            placeholder="Digite seu nome"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

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
        </Field>

        <Button
          variant="default"
          size="lg"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "CRIANDO CONTA..." : "CRIAR CONTA"}
        </Button>

        <Link to="/auth/login">
          <p className="text-center text-white-2 typ-caption">
            Já tem uma conta? <span className="link">Faça login</span>
          </p>
        </Link>
      </form>

      <AuthFooter />
    </AuthLayout>
  );
}
