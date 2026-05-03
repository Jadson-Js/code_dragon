import { useState } from "react";
import { Star, Loader2, Send, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    rate: number,
    description: string,
    reason: string,
  ) => Promise<void>;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const [rate, setRate] = useState(0);
  const [hoveredRate, setHoveredRate] = useState(0);
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rate === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(rate, description, reason);
      onClose();
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-bg-2 border-bg-3 p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 pb-0 text-left relative">
          <DialogTitle className="text-2xl font-bold text-white-1">
            Enviar Feedback
          </DialogTitle>
          <DialogDescription className="text-white-2 mt-1">
            Sua opinião nos ajuda a melhorar a plataforma
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pt-4 mt-4 space-y-6 border-t border-bg-3 mb-8">
          <div className="space-y-4">
            <h4 className="text-white-1 typ-h3 text-center">
              Como você avalia sua experiência?
            </h4>
            <div className="flex items-center gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="cursor-pointer transition-all hover:scale-110 active:scale-95"
                  onMouseEnter={() => setHoveredRate(star)}
                  onMouseLeave={() => setHoveredRate(0)}
                  onClick={() => setRate(star)}
                >
                  <Star
                    size={32}
                    strokeWidth={1.5}
                    className={
                      (hoveredRate || rate) >= star
                        ? "text-yellow fill-yellow"
                        : "text-white-2/30"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white-1 mb-2">
              Motivo do Feedback
            </label>

            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="bg-bg-1 border-bg-3 h-12 text-white-1">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TECHNICAL_ISSUE">
                  Problema técnico
                </SelectItem>
                <SelectItem value="SUGGESTION">Sugestão de melhoria</SelectItem>
                <SelectItem value="QUESTION">Dúvida</SelectItem>
                <SelectItem value="OTHER">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white-1 mb-2hite-1">
              Comentário{" "}
              <span className="text-white-2 font-normal">(opcional)</span>
            </label>
            <Textarea
              placeholder="Escreva aqui seus comentários..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-bg-1 border-bg-3 text-white-1 resize-none h-32 focus-visible:ring-primary-1/30"
            />
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex gap-3 sm:gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 bg-transparent border-bg-3 text-white-1 hover:bg-white-1/5 uppercase font-bold text-xs tracking-wider h-12"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rate === 0 || !reason || isSubmitting}
            className="flex-1 bg-primary-1 hover:bg-primary-1/90 text-white font-bold uppercase text-xs tracking-wider h-12"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Enviar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
