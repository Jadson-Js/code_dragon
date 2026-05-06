import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Gift } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/utils";
import type { QuizInsightPayload } from "../types/quiz-report.types";
import { env } from "@/shared/environments";

interface QuizInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuizInsightPayload;
}

export default function QuizInsightsModal({
  isOpen,
  onClose,
  data,
}: QuizInsightsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const referralUrl = `${env.clientUrl}/quiz/insights/session/${data.sessionQuizId}`;
  // const shareText = `🚀 Acabei de completar o Quiz de Conhecimentos com ${data.score.user}/100 pontos no Code Dragon!\n\nIdentifiquei meus gaps e já sei onde focar. Faça o seu também 👇\n\n${referralUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // const shareLinks = {
  //   linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
  //   twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
  //   whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
  //   instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing with text easily
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1100px] w-[95vw] max-h-[90vh] h-fit p-0 overflow-hidden bg-bg-1 border-white-1/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] rounded-2xl flex flex-col md:flex-row">
        {/* Lado Esquerdo: Preview do Card de Compartilhamento */}
        <div className="w-full md:w-[45%] bg-[#07070f] p-8 flex flex-col items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white-1/5">
          {/* Orbs de fundo */}
          <div className="absolute top-[-80px] right-[-60px] w-[300px] h-[300px] rounded-full bg-violet-600/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-60px] left-[-40px] w-[220px] h-[220px] rounded-full bg-purple-500/15 blur-[80px] pointer-events-none" />

          {/* Grid sutil */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* O Card */}
          <div className="relative z-10 w-[300px] bg-[#0d0d1a] rounded-[28px] border border-violet-500/20 p-7 shadow-[0_32px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
            {/* Orbs internos */}
            <div className="absolute top-[-60px] right-[-40px] w-[180px] h-[180px] rounded-full bg-violet-500/30 blur-[70px] pointer-events-none" />
            <div className="absolute bottom-[-50px] left-[-30px] w-[150px] h-[150px] rounded-full bg-purple-500/20 blur-[60px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-white text-[13px] font-bold tracking-wide">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-400 to-purple-500" />
                Code Dragon
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 tracking-wide">
                QUIZ
              </span>
            </div>

            {/* Score Ring */}
            <div className="relative z-10 flex flex-col items-center mb-5">
              <div className="relative w-[130px] h-[130px] flex items-center justify-center">
                {/* Pulse ring */}

                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 130 130"
                >
                  <circle
                    cx="65"
                    cy="65"
                    r="54"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="65"
                    cy="65"
                    r="54"
                    stroke="url(#grad)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={339}
                    strokeDashoffset={339 - (339 * data.score.user) / 100}
                    transform="rotate(-90 65 65)"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c6bff" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-[36px] font-bold leading-none bg-gradient-to-br from-white to-violet-200 bg-clip-text text-transparent">
                    {data.score.user}
                  </span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
                    pontos
                  </span>
                </div>
              </div>
              <p className="mt-2.5 text-[13px] font-semibold bg-gradient-to-r from-violet-300 via-purple-200 to-violet-300 bg-clip-text text-transparent">
                {data.insights.title}
              </p>
            </div>

            {/* Stats */}
            <div className="relative z-10 grid grid-cols-2 gap-2.5 mb-4">
              {[
                {
                  label: "Percentil",
                  value: `Top ${100 - data.percentile}%`,
                  accent: true,
                },
                { label: "Ranking", value: `#${data.ranking}`, accent: false },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-[14px] p-2.5"
                >
                  <p className="text-[9px] text-white/35 uppercase tracking-widest">
                    {label}
                  </p>
                  <p
                    className={`text-[15px] font-bold mt-0.5 ${accent ? "bg-gradient-to-br from-violet-400 to-purple-400 bg-clip-text text-transparent" : "text-white"}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Skill bars */}
            <div className="relative z-10 mb-4">
              <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2">
                Breakdown
              </p>
              {data.subjects.slice(0, 3).map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center gap-2 mb-1.5"
                >
                  <span className="text-[10px] text-white/50 w-16 flex-shrink-0 truncate text-left">
                    {subject.name}
                  </span>
                  <div className="flex-1 h-[5px] bg-white/7 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-1000"
                      style={{ width: `${subject.score.user}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40 w-6 text-right">
                    {subject.score.user}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between pt-3.5 border-t border-white/[0.06]">
              <span className="text-[10px] text-white/25">Faça o seu quiz</span>
              <span className="text-[9px] text-violet-500/60 font-mono">
                codedragon.dev
              </span>
            </div>
          </div>

          <p className="relative z-10 mt-5 text-white/25 text-xs text-center">
            Preview do seu card de compartilhamento
          </p>
        </div>

        {/* Lado Direito: Opções de Compartilhamento */}
        <div className="w-full md:w-[55%] p-10 flex flex-col">
          <DialogHeader className="text-left mb-8">
            <DialogTitle className="text-3xl font-bold text-white-1 mb-2">
              Compartilhe sua conquista!
            </DialogTitle>
            <DialogDescription className="text-white-2 text-lg">
              Mostre ao mundo sua evolução técnica e inspire outros devs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 grow">
            {/* <div className="space-y-3">
              <p className="text-sm font-semibold text-white-1 uppercase tracking-wider opacity-50">
                Compartilhar em
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="px-2 py-6 bg-[#0077b5]/10 border-[#0077b5]/30 hover:bg-[#0077b5]/20 hover:border-[#0077b5] 
                  text-white-1 font-semibold group transition-all"
                  onClick={() => window.open(shareLinks.linkedin, "_blank")}
                >
                  <Linkedin className="mr-0 h-5 w-5 text-[#0077b5]" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="px-2 py-6 bg-[#25d366]/10 border-[#25d366]/30 hover:bg-[#25d366]/20 hover:border-[#25d366] text-white-1 font-semibold group transition-all"
                  onClick={() => window.open(shareLinks.whatsapp, "_blank")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mr-0 h-5 w-5 fill-[#25d366]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </Button>
              </div>
            </div> */}

            <div className="space-y-3">
              <p className="text-sm font-semibold text-white-1 uppercase tracking-wider opacity-50">
                Link direto
              </p>
              <div className="flex gap-2">
                <div className="grow bg-bg-2 border border-white-1/10 rounded-xl px-4 flex items-center h-12 text-white-2 overflow-hidden whitespace-nowrap">
                  <span className="truncate">{referralUrl}</span>
                </div>
                <Button
                  onClick={handleCopy}
                  className={cn(
                    "h-12 px-6 font-bold transition-all shrink-0",
                    copied ? "bg-green hover:bg-green" : "",
                  )}
                >
                  {copied ? (
                    <div className="flex items-center w-20">
                      <Check className="mr-2 h-5 w-5" />
                      Copiado
                    </div>
                  ) : (
                    <div className="flex items-center w-20">
                      <Copy className="mr-2 h-5 w-5" />
                      Copiar
                    </div>
                  )}
                </Button>
              </div>
            </div>

            <div className="relative mt-8 p-6 bg-primary-1/5 rounded-2xl border border-primary-1/20 flex items-start gap-4 overflow-hidden opacity-70 cursor-not-allowed group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-yellow/10 border-b border-l border-yellow/20 rounded-bl-xl">
                <span className="text-[10px] font-bold text-yellow uppercase tracking-widest">
                  Em breve
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow/20 flex items-center justify-center shrink-0 border border-yellow/30 grayscale">
                <Gift className="text-yellow w-5 h-5" />
              </div>
              <div>
                <p className="text-white-1 font-bold text-base">
                  Recompensas por Indicação
                </p>
                <p className="text-white-2 text-sm mt-1 leading-relaxed">
                  Para cada novo desenvolvedor que fizer o quiz através do seu
                  link, você ganhará{" "}
                  <span className="text-yellow font-bold">
                    +1 quiz extra vitalício
                  </span>{" "}
                  por mês.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white-1/5 text-center">
            <p className="text-white-2 text-xs opacity-50">
              Ao compartilhar, você ajuda a fortalecer a comunidade dev.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
