import { Check, type LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

interface Props {
  title: string;
  description: string;
  Icon: LucideIcon;
  className?: string;
  isSelected?: boolean;
}

export default function GridItem({
  title,
  description,
  Icon,
  className,
  isSelected,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-4 bg-bg-2 border border-bg-3 p-8 rounded-sm cursor-pointer hover:border-primary-1 transition-all w-full relative group",
        isSelected && "selected border-primary-1 bg-primary-1/5",
        className,
      )}
    >
      <div
        className={cn(
          "absolute top-4 right-4 flex items-center justify-center w-5 h-5 rounded-full border border-bg-3",
          isSelected && "border-primary-1 bg-primary-1/10",
        )}
      >
        <Check
          className={cn("w-3 h-3 text-primary-1 hidden", isSelected && "flex")}
        />
      </div>

      <div className="w-16 h-16 rounded-full bg-primary-1/10 flex items-center justify-center">
        <Icon className="w-8 h-8 text-primary-1" />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="typ-h3 text-white-1">{title}</h3>
        <p className="text-sm text-white-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
