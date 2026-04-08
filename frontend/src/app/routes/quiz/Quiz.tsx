import { Button } from "@/components/ui/button";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import { AlertCircle, ArrowLeft, X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router";
import { useQuizQuestionsGenerate } from "@/features/dashboard/hooks/useQuizQuestionsGenerate";
import type { QuizQuestionsGenerateFormData } from "@/features/dashboard/schemas/useQuizQuestionsGenerate";
import { QuizLoader } from "@/features/quiz/components/QuizLoader";
import { useQuizQuestionsStream } from "@/features/dashboard/hooks/useQuizQuestionsStream";

export default function Quiz() {
  const { quiz_session_id } = useParams();
  const location = useLocation();
  const { mutation } = useQuizQuestionsGenerate();
  const hasCalled = useRef(false);

  useEffect(() => {
    if (quiz_session_id === "generating") {
      const formData = location.state
        ?.formData as QuizQuestionsGenerateFormData;
      if (formData && !hasCalled.current) {
        hasCalled.current = true;
        mutation.mutate(formData);
      }
    }
  }, [quiz_session_id, location.state, mutation]);

  const { questions } = useQuizQuestionsStream(quiz_session_id);
  const currentQuestion = 5;
  const totalQuestions = 20;
  const progress = (currentQuestion / totalQuestions) * 100;

  if (quiz_session_id === "generating") {
    return (
      <DashboardLayout>
        <QuizLoader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 lg:py-12">
        {/* Header with Progress & Stats */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 text-white-2 hover:text-white-1 transition-colors group">
              <X size="18" />
              <span className="text-sm font-medium">Sair do Quiz</span>
            </button>
            <div className="text-sm font-medium text-white-2 uppercase tracking-wider">
              Questão{" "}
              <span className="text-white-1">
                {currentQuestion}/{totalQuestions}
              </span>
            </div>
          </div>

          <div className="h-1 w-full bg-bg-3 rounded-full">
            <div
              className="h-full bg-primary-1 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        {/* Question Area */}
        <div className="space-y-10">
          <section className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-medium text-white-1 leading-relaxed">
              Ao desenvolver uma API Node.js utilizando TypeScript, você define
              uma interface para tipar um objeto. Considere o código abaixo.
              Qual é o comportamento esperado do compilador TypeScript ao
              realizar a atribuição por referência?
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
          </section>

          {/* Footer Actions */}
          <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-bg-3/30">
            <button className="flex items-center gap-2 text-sm text-white-2 hover:text-red transition-colors group order-2 sm:order-1">
              <AlertCircle size={16} />
              <span>Reportar erro nesta questão</span>
            </button>

            <div className="flex items-center gap-4 w-full sm:w-auto order-1 sm:order-2">
              <Button
                variant="ghost"
                size="lg"
                className="flex-1 sm:flex-none border border-bg-3 text-white-1 hover:bg-bg-2 w-30"
              >
                <ArrowLeft />
                Anterior
              </Button>

              <Button
                className="flex-1 sm:flex-none transition-all w-30"
                variant="default"
                size="lg"
              >
                Próximo
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </DashboardLayout>
  );
}
