import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function QuizExitModal({
  open,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-8 border-white-1/10 bg-bg-2">
        <DialogHeader className="items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red/10 border border-red/20 flex items-center justify-center mb-4">
            <AlertCircle className="text-red" size={32} />
          </div>

          <DialogTitle className="text-2xl font-bold text-white-1">
            Encerrar Quiz?
          </DialogTitle>

          <DialogDescription className="text-white-2 mt-2">
            Tem certeza que deseja sair? Todo o progresso desta sessão será
            perdido permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-8">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 rounded-sm transition-all duration-200 hover:bg-white-1/2"
            onClick={() => onOpenChange(false)}
          >
            CONTINUAR QUIZ
          </Button>
          <Button
            type="button"
            variant="default"
            className="flex-1 text-white font-bold rounded-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-primary-1/10"
            onClick={onConfirm}
          >
            SAIR E ENCERRAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
