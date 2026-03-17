import { Lightbulb } from "lucide-react";

export default function DashboardAuditGraph() {
  const stats = [
    { label: "LinkedIn", value: 80, color: "bg-green" },
    { label: "GitHub", value: 45, color: "bg-yellow" },
    { label: "Portfólio", value: 0, color: "bg-bg-3" },
  ];

  return (
    <div className="card bg-bg-2 h-fit flex flex-col gap-6 p-6">
      <h3 className="text-white-1 typ-h3">Empregabilidade</h3>

      <div className="flex flex-col gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white-1 font-medium">{stat.label}</span>
              <span className="text-white-2 text-sm font-bold tracking-tight">
                {stat.value}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-bg-1/50 rounded-full overflow-hidden border border-white-1/5">
              <div
                className={`h-full ${stat.color} transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]`}
                style={{
                  width: `${stat.value}%`,
                  boxShadow:
                    stat.value > 0
                      ? `0 0 10px ${stat.color === "bg-green" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`
                      : "none",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto bg-bg-1/40 border border-white-1/5 p-4 rounded-xl flex gap-3 items-start backdrop-blur-sm">
        <div className="mt-0.5 p-1.5 bg-yellow/10 rounded-lg">
          <Lightbulb size={16} className="text-yellow" />
        </div>
        <p className="text-white-2 text-sm leading-relaxed">
          Seu GitHub precisa de{" "}
          <span className="text-white-1 font-medium">Readmes melhores</span>{" "}
          para subir o score.
        </p>
      </div>
    </div>
  );
}
