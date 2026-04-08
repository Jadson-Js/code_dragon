import { X } from "lucide-react";

interface Props {
  currentQuestion: number;
  totalQuestions: number;
}

export default function QuizQuestionsHeader({
  currentQuestion,
  totalQuestions,
}: Props) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
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
  );
}

