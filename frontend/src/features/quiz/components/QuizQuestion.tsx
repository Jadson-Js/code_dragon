import { cn } from "@/shared/utils";
import { AlertCircle, Check, Copy, ThumbsUp, ThumbsDown } from "lucide-react";

import React, { useState } from "react";
import QuizQuestionFeedback from "./QuizQuestionFeedback";

interface Props {
  className?: string;
  statement: string;
  code?: string;
  alternatives: string[];
}

export default function QuizQuestion({
  className,
  statement,
  code,
  alternatives,
}: Props) {
  const [alternativeselected, setalternativeselected] = useState<
    number | null
  >();

  const alternativesArray = Array.isArray(alternatives)
    ? alternatives
    : typeof alternatives === "object" && alternatives !== null
      ? (Object.values(alternatives) as string[])
      : [];

  return (
    <div className={cn("space-y-10", className)}>
      <section className="space-y-6">
        <h1 className="text-xl sm:text-2xl font-medium text-white-1 leading-relaxed">
          {statement}
        </h1>

        {/* Minimalist Code Block */}
        {code && (
          <div className="rounded-lg border border-bg-3 bg-bg-2 overflow-hidden">
            <div className="bg-bg-3/30 px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-white-2 uppercase tracking-widest">
                TypeScript
              </span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-white-1/90">
              <pre>
                <code>{code}</code>
              </pre>
            </div>
          </div>
        )}
      </section>

      {/* alternatives List */}
      <section className="grid gap-3">
        {alternativesArray.map((text: any, idx) => {
          const letters = ["A", "B", "C", "D", "E", "F"];
          const isSelected = idx === alternativeselected;
          return (
            <button
              key={idx}
              onClick={() => setalternativeselected(idx)}
              className={cn(
                "w-full text-left flex items-center gap-5 p-5 rounded-xl border transition-all group relative cursor-pointer",
                isSelected
                  ? "border-primary-1 bg-primary-1/5"
                  : "border-bg-3/50 bg-bg-1 hover:border-bg-3",
              )}
            >
              <div
                className={cn(
                  "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors",
                  isSelected
                    ? "bg-primary-1 text-white-1"
                    : "bg-bg-2 text-white-2 group-hover:bg-bg-3 group-hover:text-white-1",
                )}
              >
                {letters[idx]}
              </div>

              <span
                className={cn(
                  "text-base transition-colors flex-1",
                  isSelected
                    ? "text-white-1"
                    : "text-white-2 group-hover:text-white-1",
                )}
              >
                {text}
              </span>

              {isSelected && (
                <Check size={18} className="text-primary-1 mr-2" />
              )}
            </button>
          );
        })}

        <QuizQuestionFeedback />
      </section>
    </div>
  );
}
