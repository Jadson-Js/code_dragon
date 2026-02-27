import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthHeader from "@/features/auth/components/AuthHeader";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { InputIcon } from "@/components/ui/input-icon";
import { LuMail } from "react-icons/lu";
import { Link } from "react-router";
import { GrFormPreviousLink } from "react-icons/gr";
import { FiSend } from "react-icons/fi";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/schemas/forgot-password-schema";
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";

export default function ForgotPassword() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    forgotPassword(data);
  };

  return (
    <AuthLayout>
      <div className="w-16 h-16 mx-auto mb-8">
        <img src="/src/assets/IconKey.svg" alt="icon" className="img" />
      </div>

      <AuthHeader
        title="Recuperar Senha"
        description="Digite o e-mail associado à sua conta e enviaremos um link de recuperação."
        centered
      />

      <form
        className="flex flex-col gap-8 mb-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputIcon
              id="email"
              type="email"
              iconLeft={<LuMail size={18} />}
              autoComplete="email"
              placeholder="seu@email.com"
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          className="w-full uppercase tracking-wide"
          loading={isPending}
        >
          <FiSend size={18} /> Enviar Link de Recuperação
        </Button>
      </form>

      <div className="flex items-center justify-center">
        <Link
          to="/login"
          className="text-white-2 text-caption flex items-center justify-center hover:text-white-1 transition-colors"
        >
          <GrFormPreviousLink size={20} /> Voltar para o login
        </Link>
      </div>
    </AuthLayout>
  );
}
