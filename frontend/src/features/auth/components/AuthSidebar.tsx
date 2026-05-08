import { FaRegCircleCheck } from "react-icons/fa6";

export default function AuthSidebar() {
  return (
    <div className="hidden md:block px-4 md:px-8 bg-linear-to-tl from-[#242565] to-[#2B2F3A] py-8 md:py-16 md:max-w-sm xl:max-w-xl">
      <div className="flex flex-row justify-center mb-8">
        <div className="h-12">
          <img src="/logo.svg" alt="logo" className="img" />
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="typ-h2 text-white-1">
          Acelere sua carreira em tecnologia
        </h2>
        <p className="typ-body text-white-2">
          Teste seus conhecimentos técnicos com quizzes gerados por IA e receba
          insights personalizados para sua evolução.
        </p>
      </div>
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-row gap-2">
          <div className="pt-1.5 text-green">
            <FaRegCircleCheck />
          </div>
          <div>
            <h3 className="typ-h3 text-white-1">Quizzes com IA</h3>
            <p className="text-white-2">
              Teste seus conhecimentos técnicos e identifique seus gaps de forma
              prática.
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="pt-1.5 text-green">
            <FaRegCircleCheck />
          </div>
          <div>
            <h3 className="typ-h3 text-white-1">Simulação de Entrevista (Em Breve)</h3>
            <p className="text-white-2">
              Pratique com IA e receba feedback detalhado para suas entrevistas.
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="pt-1.5 text-green">
            <FaRegCircleCheck />
          </div>
          <div>
            <h3 className="typ-h3 text-white-1">Auditoria de Perfil (Em Breve)</h3>
            <p className="text-white-2">Dicas para otimizar seu LinkedIn e currículo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
