import { cn } from "@/shared/utils";
import { AlertCircle, Check, Copy } from "lucide-react";
import React from "react";

interface Props {
  className?: string;
}

export default function QuizQuestion({ className }: Props) {
  return (
    <div className={cn("space-y-10", className)}>
      <section className="space-y-6">
        <h1 className="text-xl sm:text-2xl font-medium text-white-1 leading-relaxed">
          Ao desenvolver uma API Node.js utilizando TypeScript, você define uma
          interface para tipar um objeto. Considere o código abaixo. Qual é o
          comportamento esperado do compilador TypeScript ao realizar a
          atribuição por referência?
        </h1>

        {/* Minimalist Code Block */}
        <div className="rounded-lg border border-bg-3 bg-bg-2 overflow-hidden">
          <div className="bg-bg-3/30 px-4 py-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-white-2 uppercase tracking-widest">
              TypeScript
            </span>
            <button className="text-white-2 hover:text-white-1 transition-colors">
              <Copy size={14} />
            </button>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-white-1/90">
            <pre>
              <code>
                {`interface User {
  id: number;
  name: string;
}

const dataFromRequest = { 
  id: 1, 
  name: "João Silva", 
  email: "joao@email.com" 
};

const newUser: User = dataFromRequest;`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Options List */}
      <section className="grid gap-3">
        {[
          "O compilador apresentará erro porque 'email' não existe na interface 'User'.",
          "A atribuição ocorre sem erros por causa do structural typing (excess property checks são ignorados em atribuições por referência).",
          "O TypeScript removerá automaticamente a propriedade 'email' do objeto.",
          "Ocorrerá um erro de execução (runtime error), embora o compilador não detecte.",
        ].map((text, idx) => {
          const letters = ["A", "B", "C", "D"];
          const isSelected = idx === 1; // Mocking B as selected
          return (
            <button
              key={idx}
              className={cn(
                "w-full text-left flex items-center gap-5 p-5 rounded-xl border transition-all group relative",
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

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <button className="flex items-center gap-2 text-sm text-white-2 hover:text-red transition-colors group order-2 sm:order-1">
            <AlertCircle size={16} />
            <span>Reportar erro nesta questão</span>
          </button>
        </div>
      </section>
    </div>
  );
}
