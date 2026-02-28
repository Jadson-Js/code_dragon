import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input, InputMask, InputWithIcons } from "@/components/ui/input";
import AuthHeader from "@/features/auth/components/AuthHeader";
import AuthLayout from "@/features/auth/components/AuthLayout";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import AuthFooter from "@/features/auth/components/AuthFooter";

export default function Signup() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <AuthLayout>
      <AuthHeader
        title="Crie sua conta gratuita"
        text="Junte-se a milhares de devs acelerando a carreira"
        className="mb-8"
      />

      <form className="flex flex-col gap-4 mb-8">
        <div className="flex flex-row gap-4">
          <Field>
            <FieldLabel htmlFor="checkout-7j9-card-name-43j">Nome</FieldLabel>
            <Input
              id="checkout-7j9-card-name-43j"
              placeholder="Digite seu nome"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
              Data de Nascimento
            </FieldLabel>
            <InputMask
              mask="__/__/____"
              placeholder="Digite sua data de nascimento"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="checkout-7j9-card-name-43j">Email</FieldLabel>
          <InputWithIcons leftIcon={Mail} placeholder="Digite seu email" />
        </Field>

        <Field className="mb-8">
          <FieldLabel htmlFor="checkout-7j9-card-name-43j">Senha</FieldLabel>
          <InputWithIcons
            id="checkout-7j9-card-name-43j"
            placeholder="Digite sua senha"
            leftIcon={Lock}
            rightIcon={showPassword ? Eye : EyeOff}
            required
            type={showPassword ? "text" : "password"}
            onRightIconClick={() => setShowPassword(!showPassword)}
          />
        </Field>

        <Button variant="default" size="lg">
          CRIAR CONTA
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
