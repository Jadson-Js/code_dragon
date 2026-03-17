import { cn } from "@/shared/utils";
import {
  House,
  Activity,
  Mic,
  UserSearch,
  Lightbulb,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router";

export default function DashboardSidebar() {
  const { pathname } = useLocation();

  const navItems = [
    { label: "Home", to: "/", icon: House },
    { label: "Diagnósticos", to: "/diagnostics", icon: Activity },
    { label: "Entrevista IA", to: "/interview", icon: Mic },
    { label: "Auditoria Perfil", to: "/audit", icon: UserSearch },
    { label: "Caixa de Sugestões", to: "/suggestions", icon: Lightbulb },
    { label: "Configurações", to: "/settings", icon: Settings },
  ];

  return (
    <div className="w-3xs bg-bg-2 px-4 py-8 border-r border-bg-3 h-screen fixed">
      <div className="h-12 mb-12">
        <img src="/logo.svg" alt="logo" className="h-full" />
      </div>

      <div className="flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to;

          return (
            <div
              key={item.to}
              className={cn(
                "p-2 rounded-sm transition-colors duration-200",
                isActive && "bg-primary-1",
              )}
            >
              <Link
                to={item.to}
                className={cn(
                  "text-white-2 gap-2 hover:text-white-1 flex w-fit transition-colors duration-200",
                  isActive && "text-white-1",
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
