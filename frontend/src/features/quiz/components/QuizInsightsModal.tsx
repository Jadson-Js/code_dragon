import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Linkedin, Copy, Check, Gift, Instagram } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/utils";
import type { QuizInsightPayload } from "@/app/routes/quiz/QuizInsights";

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

  const referralUrl = `https://plataforma.com/resultado/${data.sessionQuizId.slice(0, 8)}`;
  const shareText = `🚀 Acabei de completar o Diagnóstico Técnico com ${data.score.user}/100 pontos no Code Dragon!\n\nIdentifiquei meus gaps e já sei onde focar. Faça o seu também 👇\n\n${referralUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing with text easily
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1100px] w-[95vw] max-h-[90vh] h-fit p-0 overflow-hidden bg-bg-1 border-white-1/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] rounded-2xl flex flex-col md:flex-row">
        {/* Lado Esquerdo: Preview do Card de Compartilhamento */}
        <div className="w-full md:w-[45%] bg-[#0f0f1b] p-8 flex flex-col items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white-1/5">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary-1/10 blur-[80px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[80px]" />
          </div>

          {/* O Card em si */}
          <div className="relative z-10 w-full max-w-[320px] aspect-[3/4] bg-gradient-to-br from-[#1a1a2e] to-[#0a0a12] rounded-3xl border border-white-1/10 p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-3">
              <img src="/logo.svg" alt="Logo" className="img" />

              <p className="text-white-2 text-xs uppercase tracking-widest ">
                Diagnóstico Técnico
              </p>
            </div>

            <div className="flex flex-1 justify-center flex-col items-center my-auto">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white-1/5"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * data.score.user) / 100}
                    className="text-primary-2"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white-1">
                    {data.score.user}
                  </span>
                  <span className="text-[10px] text-white-2 uppercase">
                    Pontos
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full ">
              <div className="bg-white-1/5 rounded-xl p-2 border border-white-1/10">
                <p className="text-[10px] text-white-2 uppercase">Percentil</p>
                <p className="text-sm font-bold text-white-1">
                  Top {100 - data.percentile}%
                </p>
              </div>
              <div className="bg-white-1/5 rounded-xl p-2 border border-white-1/10">
                <p className="text-[10px] text-white-2 uppercase">Ranking</p>
                <p className="text-sm font-bold text-white-1">
                  #{data.ranking}
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 mt-6 text-white-2 text-xs text-center opacity-60">
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

          <div className="space-y-6 flex-grow">
            <div className="space-y-3">
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
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-white-1 uppercase tracking-wider opacity-50">
                Link direto
              </p>
              <div className="flex gap-2">
                <div className="flex-grow bg-bg-2 border border-white-1/10 rounded-xl px-4 flex items-center h-12 text-white-2 overflow-hidden whitespace-nowrap">
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

            <div className="mt-8 p-6 bg-primary-1/5 rounded-2xl border border-primary-1/20 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow/20 flex items-center justify-center shrink-0 border border-yellow/30">
                <Gift className="text-yellow w-5 h-5" />
              </div>
              <div>
                <p className="text-white-1 font-bold text-base">
                  Recompensa Ativa!
                </p>
                <p className="text-white-2 text-sm mt-1 leading-relaxed">
                  Para cada novo desenvolvedor que fizer o diagnóstico através
                  do seu link, você ganha{" "}
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
