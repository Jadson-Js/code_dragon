import { cn } from "@/shared/utils";
import { Check, Copy } from "lucide-react";

import { useState } from "react";
import QuizQuestionFeedback from "./QuizQuestionFeedback";

interface Props {
  className?: string;
  statement: string;
  code?: string;
  alternatives: string[];
  stack: string;
  selectedAlternative?: number | null;
  onSelectAlternative?: (index: number) => void;
  feedback?: "up" | "down" | null;
  onFeedbackChange?: (feedback: "up" | "down" | null) => void;
}

export default function QuizQuestion({
  className,
  statement,
  code,
  alternatives,
  stack,
  selectedAlternative,
  onSelectAlternative,
  feedback,
  onFeedbackChange,
}: Props) {
  const [copied, setCopied] = useState(false);

  const alternativesArray = Array.isArray(alternatives)
    ? alternatives
    : typeof alternatives === "object" && alternatives !== null
      ? (Object.values(alternatives) as string[])
      : [];

  return (
    <div className={cn(className)}>
      <section className="space-y-6 mb-4">
        <h1 className="text-xl sm:text-2xl font-medium text-white-1 leading-relaxed">
          {statement}
        </h1>

        {/* Minimalist Code Block */}
        {code && (
          <div className="rounded-xl border border-bg-3 bg-bg-2 overflow-hidden group/code relative shadow-2xl">
            <div className="bg-bg-3/50 px-4 py-3 flex items-center justify-between border-b border-bg-3/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 opacity-60">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20 border border-yellow-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/20 border border-green-400/40" />
                </div>
                <span className="text-[10px] ml-3 font-bold text-white-2 uppercase tracking-[0.2em]">
                  {stack}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code.replace(/\\n/g, "\n"));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-white-2 hover:text-white-1 transition-all p-2 rounded-lg hover:bg-bg-3 flex items-center gap-2 active:scale-95 cursor-pointer"
                title="Copiar código"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green" />
                    <span className="text-[10px] font-bold text-green uppercase tracking-wider">
                      Copiado!
                    </span>
                  </>
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
            <div className="font-mono text-[13px] leading-[1.8] overflow-x-auto text-white-1/90 bg-bg-1/40 custom-scrollbar">
              <pre className="p-6 flex gap-6 min-w-full">
                <div className="flex flex-col text-white-2/20 select-none text-right border-r border-bg-3/30 pr-4 sticky left-0 bg-bg-1/5 backdrop-blur-sm -ml-6 pl-6">
                  {code
                    .replace(/\\n/g, "\n")
                    .split("\n")
                    .map((_, i) => (
                      <span key={i} className="leading-[1.8]">
                        {i + 1}
                      </span>
                    ))}
                </div>
                <code className="block whitespace-pre break-normal pr-6">
                  {code.replace(/\\n/g, "\n")}
                </code>
              </pre>
            </div>
          </div>
        )}
      </section>

      {/* alternatives List */}
      <section className="grid gap-3">
        {alternativesArray.map((text: any, idx) => {
          const letters = ["A", "B", "C", "D", "E", "F"];
          const isSelected = idx === selectedAlternative;
          return (
            <button
              key={idx}
              onClick={() => onSelectAlternative?.(idx)}
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

              <Check
                size={18}
                className={cn(
                  "text-primary-1 mr-2",
                  isSelected ? "block" : "invisible",
                )}
              />
            </button>
          );
        })}

        <QuizQuestionFeedback value={feedback} onChange={onFeedbackChange} />
      </section>
    </div>
  );
}
