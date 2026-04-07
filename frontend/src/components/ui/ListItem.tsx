import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface Props {
  title?: string;
  description?: string;
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
        "flex items-center gap-4 bg-bg-2 border border-bg-3 p-4 rounded-sm cursor-pointer hover:border-primary-1 transition-all w-full relative group",
        isSelected && "selected border-primary-1 bg-primary-1/5",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-5 h-5 rounded-full border border-bg-3",
          isSelected && "border-primary-1 bg-primary-1/10",
        )}
      >
        <Check
          className={cn("w-3 h-3 text-primary-1 hidden", isSelected && "flex")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="typ-h3 text-white-1">{title}</h3>
        <p className="text-sm text-white-2">{description}</p>
      </div>
    </div>
  );
}
