import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatItemProps {
  icon?: ReactNode;
  value: string;
  label: string;
  className?: string;
}

function StatItem({ icon, value, label, className }: StatItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 group transition-transform hover:scale-105",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-primary-1">
        {icon && (
          <span className="opacity-80 group-hover:opacity-100 transition-opacity">
            {icon}
          </span>
        )}
        <span className="font-bold text-lg">{value}</span>
      </div>
      <span className="text-white-2 text-sm">{label}</span>
    </div>
  );
}

interface StatsGroupProps {
  children: ReactNode;
  className?: string;
}

function StatsGroup({ children, className }: StatsGroupProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-6 sm:gap-10 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export { StatItem, StatsGroup };
