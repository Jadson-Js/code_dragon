import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { type LucideIcon } from "lucide-react";

interface TermsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  content: string;
  icon: LucideIcon;
}

export function TermsDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  content,
  icon: Icon,
}: TermsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 border-bg-3 overflow-hidden bg-bg-1">
        <div className="p-8 flex flex-col items-center">
          {/* Circular Icon Placeholder based on design */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary-1/20 rounded-full blur-xl scale-150" />
            <div className="relative w-16 h-16 rounded-full bg-bg-2 border border-white/5 flex items-center justify-center">
              <Icon className="text-primary-1 size-6" />
            </div>
          </div>

          <DialogHeader className="text-center sm:text-center w-full">
            <DialogTitle className="text-2xl font-bold text-white-1 mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-white-2 text-sm leading-relaxed mb-8">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="w-full h-px bg-white/5 mb-8" />

          <div className="w-full overflow-y-auto pr-2 custom-scrollbar text-white-2 text-sm leading-relaxed space-y-4">
            {content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
