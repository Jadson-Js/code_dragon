import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";

interface Props {
  title: string;
  description: string;
  className?: string;
  isSelected?: boolean;
}

export default function ListItem({
  title,
  description,
  className,
  isSelected,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 bg-bg-2 border border-bg-3 p-4 rounded-sm cursor-pointer hover:border-primary-1 transition-all w-full relative group",
        isSelected && "selected border-primary-1 bg-primary-1/5",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="typ-h3 text-white-1">{title}</h3>
        <p className="text-sm text-white-2">{description}</p>
      </div>

      <div
        className={cn(
          "hidden items-center justify-center w-6 h-6 rounded-full border border-primary-1 bg-primary-1/10",
          isSelected && "flex",
        )}
      >
        <Check className="w-4 h-4 text-primary-1" />
      </div>
    </div>
  );
}
