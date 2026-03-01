import { cn } from "@/shared/utils";
import { Check } from "lucide-react";

export default function CircleCheck({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "p-1 rounded-full bg-green/10 border-2 border-green/40 flex items-center justify-center",
        className,
      )}
    >
      <Check className="text-green" size={16} />
    </div>
  );
}
