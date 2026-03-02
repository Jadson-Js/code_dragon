import AuthLayout from "@/features/auth/layout/AuthLayout";
import { Link, useNavigate, useParams } from "react-router";
import { ButtonWithIcons } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import AuthHeader from "@/features/auth/components/AuthHeader";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { InputWithIcons } from "@/components/ui/input";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth/schemas/resetPasswordSchema";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useResetPassword();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    const result = await resetPassword(data);

    if (result.error === "token") {
      navigate("/auth/forgot-password");
      return;
    }

    if (!result.error) {
      navigate("/auth/login");
    }
  };

  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-24 h-24 rounded-full border border-primary-2/40 bg-primary-1/5 mb-4 m-auto">
        <Lock className="w-12 h-12 text-primary-1" strokeWidth={1.5} />
      </div>

      <AuthHeader
        title="Recuperar Senha"
        description="Digite a nova senha para a sua conta."
        className="text-center mb-8"
      />

      <form
        className="w-full bg-bg-2 card mb-8 p-6 border border-bg-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Campo oculto para o token */}
        <input type="hidden" {...register("token")} />

        <Field className="mb-4">
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <InputWithIcons
            id="password"
            placeholder="Digite sua nova senha"
            leftIcon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            type={showPassword ? "text" : "password"}
            onRightIconClick={() => setShowPassword((p) => !p)}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <Field className="mb-8">
          <FieldLabel htmlFor="confirmPassword">Confirmar Senha</FieldLabel>
          <InputWithIcons
            id="confirmPassword"
            placeholder="Confirme sua nova senha"
            leftIcon={Lock}
            rightIcon={showConfirmPassword ? EyeOff : Eye}
            type={showConfirmPassword ? "text" : "password"}
            onRightIconClick={() => setShowConfirmPassword((p) => !p)}
            {...register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        <ButtonWithIcons
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Redefinindo..." : "Redefinir Senha"}
        </ButtonWithIcons>
      </form>

      <div className="flex justify-center">
        <Link
          to="/auth/login"
          className="text-white-2 hover:text-white-1 flex flex-row items-center"
        >
          <ArrowLeft className="mr-1" strokeWidth={1.5} />
          Voltar para o login
        </Link>
      </div>
    </AuthLayout>
  );
}
