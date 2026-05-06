import { cn } from "@/shared/utils";
import {
  House,
  Activity,
  Lightbulb,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import QuizConfigModal from "../features/dashboard/components/QuizConfigModal";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/", icon: House },
    { label: "Quizzes", to: "/quiz", icon: Activity },
    { label: "Caixa de Sugestões", to: "/suggestion", icon: Lightbulb },
    // { label: "Configurações", to: "/settings", icon: Settings },
  ];

  return (
    <div className="w-3xs bg-bg-2 px-4 py-8 border-r border-bg-3 h-screen fixed">
      <div className="h-12 mb-12">
        <img src="/logo.svg" alt="logo" className="h-full" />
      </div>

      <div className="flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

          const isQuizLink = item.to === "/quiz";

          const handleClick = (e: React.MouseEvent) => {
            if (isQuizLink) {
              e.preventDefault();
              setIsQuizModalOpen(true);
            }
          };

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleClick}
              className={cn(
                "text-white-2  hover:text-white-1  transition-colors duration-200",
                isActive && "text-white-1",
              )}
            >
              <div
                className={cn(
                  "flex gap-2 p-2 rounded-sm transition-colors duration-200 w-full items-center",
                  isActive && "bg-primary-1",
                )}
              >
                <Icon size={20} />
                <span className="flex-1">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Modal de Configuração do Quiz */}
      <QuizConfigModal
        open={isQuizModalOpen}
        onOpenChange={setIsQuizModalOpen}
      />
    </div>
  );
}
