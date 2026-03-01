import { Button } from "@/components/ui/button";
import { User, ShieldCheck, FileText } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import * as React from "react";
import { TermsDialog } from "./TermsDialog";

export default function AuthFooter() {
  const [modalType, setModalType] = React.useState<"terms" | "privacy" | null>(
    null,
  );

  return (
    <div>
      <div className="flex flex-row items-center gap-2 mb-8">
        <div className="flex-1 border-b-2 border-bg-3" />
        <span className="text-bg-3 typ-caption">OU</span>
        <div className="flex-1 border-b-2 border-bg-3" />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full gap-3 transition-all cursor-pointer mb-8"
      >
        <FcGoogle className="size-5" />
        Entrar com Google
      </Button>

      <div className="flex flex-row items-center justify-between mb-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row gap-1 items-center text-primary-1">
            <User className="" />
            <span className="font-bold">5K+</span>
          </div>
          <p className="text-white-2 typ-caption">Usuários ativos</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row gap-1 items-center text-primary-1">
            <User className="" />
            <span className="font-bold">5K+</span>
          </div>
          <p className="text-white-2 typ-caption">Usuários ativos</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row gap-1 items-center text-primary-1">
            <User className="" />
            <span className="font-bold">5K+</span>
          </div>
          <p className="text-white-2 typ-caption">Usuários ativos</p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2">
        <p className="text-center text-white-2 typ-caption">
          Ao se cadastrar, você concorda com os{" "}
          <span className="link" onClick={() => setModalType("terms")}>
            Termos de Uso
          </span>{" "}
          e a{" "}
          <span className="link" onClick={() => setModalType("privacy")}>
            Política de Privacidade
          </span>
        </p>
      </div>

      <TermsDialog
        isOpen={modalType === "terms"}
        onOpenChange={(open) => !open && setModalType(null)}
        title="Termos de Uso"
        description="Leia atentamente as regras de utilização da plataforma CodeDragon."
        icon={FileText}
        content={`Bem-vindo ao CodeDragon! Ao acessar ou usar nosso serviço, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, você não poderá acessar o serviço.\n\nUso do Serviço: Você deve fornecer informações precisas e completas ao criar sua conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem sob sua conta.\n\nConteúdo: Todo o conteúdo disponível no CodeDragon é protegido por direitos autorais. Você não pode copiar, modificar ou distribuir o conteúdo sem nossa permissão expressa.\n\nAlterações nos Termos: Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos você sobre quaisquer alterações publicando os novos termos nesta página.`}
      />

      <TermsDialog
        isOpen={modalType === "privacy"}
        onOpenChange={(open) => !open && setModalType(null)}
        title="Política de Privacidade"
        description="Entenda como tratamos seus dados e garantimos sua segurança."
        icon={ShieldCheck}
        content={`Sua privacidade é importante para nós. Esta política explica como coletamos, usamos e protegemos suas informações pessoais.\n\nColeta de Dados: Coletamos informações que você fornece voluntariamente, como seu nome e endereço de e-mail ao se registrar.\n\nUso das Informações: Usamos seus dados para fornecer e melhorar o serviço, comunicar-nos com você e garantir a segurança da sua conta.\n\nSegurança: Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado ou perda. No entanto, lembre-se de que nenhum método de transmissão pela internet é 100% seguro.\n\nSeus Direitos: Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento através das configurações da sua conta.`}
      />
    </div>
  );
}
