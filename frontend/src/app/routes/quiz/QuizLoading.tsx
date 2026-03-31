import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuizQuestionsGenerate } from "@/features/dashboard/hooks/useQuizQuestionsGenerate";
import {
  Loader2,
  Activity,
  Zap,
  FileText,
  Mic,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import type { QuizQuestionsGenerateFormData } from "@/features/dashboard/schemas/useQuizQuestionsGenerate";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";

const PROMO_ADS = [
  {
    icon: Zap,
    label: "ANÁLISE PROFUNDA",
    title: "Cansado de feedbacks rasos?",
    description: (
      <>
        No <strong className="text-white-1">Plano Pro</strong>, nossa IA Tech
        Lead analisa seu código linha por linha.
      </>
    ),
    color: "text-amber-400",
  },
  {
    icon: FileText,
    label: "VÁ ALÉM DO ATS",
    title: "75% dos currículos são descartados",
    description: (
      <>
        Sabia disso? Nosso{" "}
        <strong className="text-white-1">Gerador de CV</strong> é otimizado para
        vencer o ATS e colocar você na entrevista.
      </>
    ),
    color: "text-blue-400",
  },
  {
    icon: Mic,
    label: "CARREIRA GLOBAL",
    title: "Treine para sua entrevista em inglês",
    description: (
      <>
        Destrave sua fala com nosso{" "}
        <strong className="text-white-1">Simulador de Voz</strong> e receba
        feedback imediato de pronúncia.
      </>
    ),
    color: "text-emerald-400",
  },
];

export default function QuizLoading() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutation } = useQuizQuestionsGenerate();
  const hasCalled = useRef(false);

  const [adIndex, setAdIndex] = useState(0);

  // Ad Carousel Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % PROMO_ADS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Redirect on Success logic
  useEffect(() => {
    if (mutation.isSuccess) {
      navigate("/");
    }
  }, [mutation.isSuccess, navigate]);

  // API Call Logic
  useEffect(() => {
    const formData = location.state?.formData as
      | QuizQuestionsGenerateFormData
      | undefined;

    if (!formData) return;

    if (!hasCalled.current && !mutation.isPending && !mutation.isSuccess) {
      hasCalled.current = true;
      mutation.mutate(formData);
    }
  }, [location, navigate, mutation]);

  const currentAd = PROMO_ADS[adIndex];
  const CurrentAdIcon = currentAd.icon;

  return (
    <DashboardLayout>
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Deep background decoration */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-1/5 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        </div>

        <div className="relative flex flex-col items-center w-full max-w-3xl z-10">
          <div className="relative mb-14 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary-1/10 border-2 border-primary-1/30 flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-1),0.15)] z-10">
              <Activity className="text-primary-1 animate-pulse" size={48} />
            </div>

            {/* Spinning rings with different speeds */}
            <div className="absolute inset-[-15px] rounded-full border-2 border-primary-1/10 border-t-primary-1/40 animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-[-30px] rounded-full border border-primary-1/5 border-b-primary-1/30 animate-[spin_6s_linear_infinite_reverse]" />
          </div>

          <div className="text-center mb-12 space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white-1 tracking-tight">
              Sintonizando seu{" "}
              <span className="text-primary-1">Desafio Único</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Nossa IA está refinando questões baseadas na seu perfil...
            </p>
          </div>

          {/* Dynamic "Loading-mercial" Carousel */}
          <div className="relative w-full max-w-xl mb-8">
            <div
              key={adIndex}
              className={`group relative overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700 p-4 rounded-sm bg-bg-2 border border-white-1/10 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center md:items-start gap-4 border-l-4 ${currentAd.color.replace("text", "border")}`}
            >
              {/* Icon Section */}
              <div
                className={`w-16 h-16 rounded-sm bg-white-1/5 flex items-center justify-center shrink-0 border border-white-1/10 ${currentAd.color} shadow-sm`}
              >
                <CurrentAdIcon size={32} strokeWidth={1} />
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[10px] font-black tracking-widest uppercase py-1 px-2 rounded-sm bg-primary-1/10 border border-primary-1/20 text-primary-1`}
                  >
                    PLANO PRO
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white-1 mb-2 leading-tight">
                  {currentAd.title}
                </h3>

                <p className="text-white-2 text-sm md:text-base leading-relaxed opacity-70 mb-6 max-w-md">
                  {currentAd.description}
                </p>
              </div>

              {/* Carousel Indicators - Absoluted to bottom left */}
              <div className="absolute bottom-4 right-8 flex gap-1.5 mt-8">
                {PROMO_ADS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-sm transition-all duration-500 ${
                      i === adIndex ? "bg-primary-1 w-6" : "bg-white-1/10 w-2"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
