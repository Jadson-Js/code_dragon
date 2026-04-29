import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/shared/utils";

type QuizQuestionFeedbackValue = "up" | "down" | null;

interface QuizQuestionFeedbackProps {
  value?: QuizQuestionFeedbackValue;
  onChange?: (value: QuizQuestionFeedbackValue) => void;
}

export default function QuizQuestionFeedback({
  value = null,
  onChange,
}: QuizQuestionFeedbackProps) {
  const [internalFeedback, setInternalFeedback] =
    useState<QuizQuestionFeedbackValue>(null);
  const feedback = onChange ? value : internalFeedback;

  const handleFeedback = (type: "up" | "down") => {
    const nextFeedback = feedback === type ? null : type;

    if (onChange) {
      onChange(nextFeedback);
      return;
    }

    setInternalFeedback(nextFeedback);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleFeedback("up")}
            className={cn(
              "p-2 rounded-full transition-all group cursor-pointer",
              feedback === "up"
                ? "text-primary-1 bg-primary-1/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                : "text-white-2 hover:bg-bg-3 hover:text-primary-1",
            )}
          >
            <ThumbsUp
              size={18}
              className={cn(
                "transition-all duration-300",
                feedback === "up" ? "scale-110" : "group-hover:scale-110",
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gostei</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleFeedback("down")}
            className={cn(
              "p-2 rounded-full transition-all group cursor-pointer",
              feedback === "down"
                ? "text-red bg-red/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                : "text-white-2 hover:bg-bg-3 hover:text-red",
            )}
          >
            <ThumbsDown
              size={18}
              className={cn(
                "transition-all duration-300",
                feedback === "down" ? "scale-110" : "group-hover:scale-110",
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Não gostei</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
