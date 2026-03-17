import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { subject: "Frontend", A: 80, B: 60, fullMark: 100 },
  { subject: "Backend", A: 65, B: 70, fullMark: 100 },
  { subject: "Database", A: 75, B: 55, fullMark: 100 },
  { subject: "DevOps", A: 50, B: 45, fullMark: 100 },
  { subject: "CS Fund.", A: 85, B: 65, fullMark: 100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-3 card">
        <p className="text-white-1 font-bold mb-2">{label}</p>

        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />

              <span className="text-white-2 typ-caption">
                {entry.name}:{" "}
                <span className="text-white-1 font-medium">{entry.value}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardMapSkills() {
  return (
    <div className="card bg-bg-2 h-full flex flex-col gap-4 min-h-80">
      <h3 className="text-white-1 typ-h3">Mapa de Habilidades</h3>

      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={data}
            style={{ outline: "none" }}
          >
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Market Average (Dashed Grey) */}
            <Radar
              name="Média do Mercado"
              dataKey="B"
              stroke="#475569"
              fill="transparent"
              strokeDasharray="4 4"
              strokeWidth={2}
            />
            {/* User (Purple Filled) */}
            <Radar
              name="Você"
              dataKey="A"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between gap-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary-1 border-2 border-primary-1" />
          <span className="text-white-2 text-sm font-medium">Você</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
          <span className="text-white-2 text-sm font-medium">
            Média do Mercado
          </span>
        </div>
      </div>
    </div>
  );
}
