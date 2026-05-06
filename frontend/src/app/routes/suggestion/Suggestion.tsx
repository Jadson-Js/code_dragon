import React, { useState } from "react";
import {
  Sparkles,
  Bug,
  MessageSquare,
  Send,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import { useFeedbackSubmit } from "@/features/quiz/hooks/useFeedbackSubmit";
import { toast } from "sonner";

type FeedbackType = "feature" | "bug" | "other";

const REASON_MAP: Record<FeedbackType, string> = {
  feature: "SUGGESTION",
  bug: "TECHNICAL_ISSUE",
  other: "OTHER",
};

export default function Suggestion() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("feature");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { mutateAsync: submitFeedback, isPending: isSubmitting } =
    useFeedbackSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Por favor, insira um título para sua sugestão.");
      return;
    }

    try {
      await submitFeedback({
        rate: 5, // Default rate for suggestions
        reason: REASON_MAP[feedbackType],
        description: `[${title}] ${description}`.trim(),
      });

      toast.success("Sugestão enviada com sucesso! Obrigado pela colaboração.");
      setTitle("");
      setDescription("");
      setFeedbackType("feature");
    } catch (error) {
      toast.error("Erro ao enviar sugestão. Tente novamente mais tarde.");
      console.error("Erro ao enviar feedback:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-bg-1 text-white-1 p-4 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Central de Sugestões
            </h1>
            <p className="text-white-2 text-lg">
              Analise seu perfil profissional completo e receba insights
              personalizados
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-bg-2 border border-bg-3 rounded-2xl p-4 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Feedback Type Selection */}
              <div className="space-y-4">
                <Label className="text-white-1 text-lg font-medium">
                  Qual o tipo de feedback?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "feature", label: "Nova Feature", icon: Sparkles },
                    { id: "bug", label: "Reportar Bug", icon: Bug },
                    { id: "other", label: "Outros", icon: MessageSquare },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id as FeedbackType)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                        feedbackType === type.id
                          ? "border-primary-1 bg-primary-1/10 text-primary-1"
                          : "border-bg-3 bg-bg-1 text-white-2 hover:border-white-2/30 hover:text-white-1",
                      )}
                    >
                      <type.icon size={24} />
                      <span className="font-semibold">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-white-1 text-lg font-medium"
                >
                  Titulo
                </Label>
                <Input
                  id="title"
                  placeholder="Dê um título para sua sugestão"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-bg-1 border-bg-3 h-14 text-lg focus-visible:ring-primary-1/30"
                />
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="description"
                    className="text-white-1 text-lg font-medium"
                  >
                    Descrição
                  </Label>
                  <span className="text-white-2 text-sm">(opcional)</span>
                </div>
                <Textarea
                  id="description"
                  placeholder="Descreva sua ideia em detalhes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-bg-1 border-bg-3 min-h-[150px] text-lg resize-none focus-visible:ring-primary-1/30"
                />
              </div>

              {/* Image Upload */}
              {/* <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-white-1 text-lg font-medium">
                    Anexar imagem
                  </Label>
                  <span className="text-white-2 text-sm">(opcional)</span>
                </div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    // Handle file drop logic here
                  }}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-all duration-200 cursor-pointer",
                    isDragging
                      ? "border-primary-1 bg-primary-1/5"
                      : "border-bg-3 bg-bg-1 hover:border-white-2/30",
                  )}
                >
                  <div className="p-4 rounded-full bg-bg-3 text-white-2">
                    <Upload size={32} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-white-1 font-medium">
                      Arraste um print ou
                    </p>
                    <p className="text-white-2 text-sm uppercase tracking-wider">
                      PNG, JPG ou GIF até 5MB
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-1 hover:bg-primary-1/90 text-white px-10 py-6 text-lg font-bold uppercase tracking-widest gap-2 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Footer Tip */}
          <div className="flex items-center gap-3 text-white-2 bg-white-1/5 p-4 rounded-lg">
            <Lightbulb className="text-yellow-400" size={20} />
            <p>
              <span className="font-bold">Dica:</span> Quanto mais detalhes você
              fornecer, melhor conseguiremos entender e priorizar sua sugestão
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
