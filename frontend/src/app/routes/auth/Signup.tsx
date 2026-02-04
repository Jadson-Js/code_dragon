import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputIcon } from "@/components/ui/input-icon";
import { InputMask } from "@/components/ui/input-mask";
import AuthFooterForm from "@/features/auth/components/AuthFooterForm";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "admin",
    birthdate: "08/03/2005",
    email: "admin@admin.com",
    password: "admin123",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    navigate("/verify-email");
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 mb-6">
          <FieldGroup>
            <div className="flex flex-col gap-6 md:flex-row md:gap-4">
              {/* Nome */}
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <InputIcon
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Digite seu nome aqui"
                  autoComplete="name"
                  required
                  iconLeft={<LuUser size={18} />}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Field>
              {/* Data de Nascimento */}
              <Field>
                <FieldLabel htmlFor="birthdate">Data de Nascimento</FieldLabel>
                <InputMask
                  id="birthdate"
                  name="birthdate"
                  mask="date"
                  autoComplete="bday"
                  iconLeft={<LuCalendar size={18} />}
                  required
                  value={formData.birthdate}
                  onValueChange={(e) => {
                    setFormData({ ...formData, birthdate: e });
                  }}
                />
              </Field>
            </div>

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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Field>
          </FieldGroup>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full uppercase tracking-wide"
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
