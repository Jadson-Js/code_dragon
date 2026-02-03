import { FaRegCircleCheck } from "react-icons/fa6";

export default function AuthSidebar() {
  return (
    <div className="content bg-linear-to-tl from-[#242565] to-[#2B2F3A] py-8 md:py-16 md:max-w-sm xl:max-w-xl">
        <div className="flex flex-row justify-center mb-8">
          <div className="h-12">
            <img src="/public/logo.svg" alt="logo" className="img" />
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-h2 text-white-1">
            Acelere sua carreira em tecnologia
          </h2>
          <p className="text-body text-white-2">
            Diagnósticos personalizados, simulações de entrevista com IA e
            auditoria completa do seu perfil profissional.
          </p>
        </div>
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-row gap-2">
            <div className="pt-1.5 text-green">
              <FaRegCircleCheck />
            </div>
            <div>
              <h3 className="text-h3 text-white-1">
                Acelere sua carreira em tecnologia
              </h3>
              <p className="text-white-2">
                Diagnósticos personalizados, simulações de entrevista com IA e
                auditoria completa do seu perfil profissional.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="pt-1.5 text-green">
              <FaRegCircleCheck />
            </div>
            <div>
              <h3 className="text-h3 text-white-1">Simulação de Entrevista</h3>
              <p className="text-white-2">
                Pratique com IA e receba feedback detalhado
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="pt-1.5 text-green">
              <FaRegCircleCheck />
            </div>
            <div>
              <h3 className="text-h3 text-white-1">Auditoria de Perfil</h3>
              <p className="text-white-2">Otimize seu LinkedIn e currículo</p>
            </div>
          </div>
        </div>
   
    </div>
  );
}
