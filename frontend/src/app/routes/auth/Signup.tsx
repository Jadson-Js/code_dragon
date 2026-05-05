import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input, InputWithIcons } from "@/components/ui/input";
import AuthLayout from "@/features/auth/layout/AuthLayout";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import AuthFooter from "@/features/auth/components/AuthFooter";
import { useSignup } from "@/features/auth/hooks/useSignup";
import PageHeader from "@/components/PageHeader";

export default function Signup() {
  const { form, mutation } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <AuthLayout>
      <PageHeader
        title="Crie sua conta gratuita"
        description="Acompanhe sua evolução como desenvolvedor de forma prática"
        className="mb-8"
      />

      <form
        className="flex flex-col gap-4 mb-8"
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
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
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "CRIANDO CONTA..." : "CRIAR CONTA"}
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
