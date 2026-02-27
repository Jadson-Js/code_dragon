import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LuUser,
  LuCalendar,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";

import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { InputIcon } from "@/components/ui/input-icon";
import { InputMask } from "@/components/ui/input-mask";
import AuthFooterForm from "@/features/auth/components/AuthFooterForm";

import { useSignup } from "@/features/auth/hooks/use-signup";
import {
  signupSchema,
  type SignupValues,
} from "@/features/auth/schemas/signup-schema";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const { mutate: signup, isPending, error } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "admin",
      birthDate: "08/03/2005",
      email: "jadson20051965@gmail.com",
      password: "admin123",
    },
  });

  const onSubmit = (data: SignupValues) => {
    signup(data);
  };

  return (
    <AuthLayout>
      <div className="content py-8 w-full max-w-xl m-auto">
        {/* Header */}
        <header className="flex flex-col gap-2 mb-8">
          <h1 className="text-h1 text-white-1">Crie sua conta gratuita</h1>
          <p className="text-white-2">
            Junte-se a milhares de devs acelerando a carreira
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 mb-6"
        >
          <FieldGroup>
            <div className="flex flex-col gap-6 md:flex-row md:gap-4">
              {/* Nome */}
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <InputIcon
                  id="name"
                  placeholder="Digite seu nome aqui"
                  autoComplete="name"
                  iconLeft={<LuUser size={18} />}
                  {...register("name")}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              {/* Data de Nascimento */}
              <Field>
                <FieldLabel htmlFor="birthDate">Data de Nascimento</FieldLabel>
                <InputMask
                  id="birthDate"
                  mask="date"
                  autoComplete="bday"
                  iconLeft={<LuCalendar size={18} />}
                  {...register("birthDate")}
                />
                <FieldError errors={[errors.birthDate]} />
              </Field>
            </div>

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
                autoComplete="new-password"
                iconLeft={<LuLock size={18} />}
                iconRight={
                  showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />
                }
                onIconRightClick={togglePasswordVisibility}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
          </FieldGroup>

          {/* API Error */}
          {error && <FieldError errors={[error]} />}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full uppercase tracking-wide"
            loading={isPending}
          >
            Criar Conta
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-white-2 text-sm mb-6">
          Já tem uma conta?{" "}
          <Link to="/login" className="link">
            Fazer login
          </Link>
        </p>

        <AuthFooterForm />
      </div>
    </AuthLayout>
  );
}
