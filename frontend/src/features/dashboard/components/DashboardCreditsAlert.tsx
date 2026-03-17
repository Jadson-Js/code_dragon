import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import PageHeader from "@/components/PageHeader";

interface Props {
  className?: string;
}

export default function DashboardCreditsAlert({ className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between card bg-bg-1 border border-yellow/20",
        className,
      )}
    >
      <div className="flex gap-4 items-start">
        <div className="mt-1 bg-yellow/20 card p-1">
          <Zap size={18} className="text-yellow " />
        </div>
        <div>
          <PageHeader
            title="Seus créditos estão acabando"
            description="Continue praticando com mais 10 simulações e 3 auditorias"
            type="h3"
          />
        </div>
      </div>

      <Button
        variant="default"
        className="bg-primary-1 hover:bg-primary-1/80 text-white-1  transition-colors duration-200"
      >
        Adquirir Pack por R$ 49,90
      </Button>
    </div>
  );
}
