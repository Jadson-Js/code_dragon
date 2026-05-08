import { X } from "lucide-react";

interface Props {
  currentQuestion: number;
  totalQuestions: number;
  isFinished: boolean;
  onExit: () => void;
}

export default function QuizQuestionsHeader({
  currentQuestion,
  totalQuestions,
  isFinished,
  onExit,
}: Props) {
  const progress = isFinished
    ? (currentQuestion / totalQuestions) * 100
    : Math.min((currentQuestion / Math.max(totalQuestions, 1)) * 100, 95);

  return (
    <header className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-white-2 hover:text-white-1 transition-colors group cursor-pointer"
        >
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
