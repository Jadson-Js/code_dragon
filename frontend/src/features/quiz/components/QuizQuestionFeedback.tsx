import { ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function QuizQuestionFeedback() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="p-2 rounded-full text-white-2 hover:bg-bg-3 hover:text-primary-1 transition-all group cursor-pointer">
            <ThumbsUp
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gostei</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="p-2 rounded-full text-white-2 hover:bg-bg-3 hover:text-red transition-all group cursor-pointer">
            <ThumbsDown
              size={16}
              className="group-hover:scale-110 transition-transform"
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
