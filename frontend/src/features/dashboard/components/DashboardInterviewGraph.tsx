import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import PageHeader from "@/components/PageHeader";

const data = [
  { day: "10/", month: "Jan", score: 45, overall: 75 },
  { day: "12/", month: "Jan", score: 62, overall: 75 },
  { day: "14/", month: "Jan", score: 55, overall: 75 },
  { day: "15/", month: "Jan", score: 72, overall: 75 },
  { day: "17/", month: "Jan", score: 76, overall: 75 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-3 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-white-1 font-bold mb-2">
          {label} {data.find((d) => d.day === label)?.month}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-white-2 text-xs">
                  {entry.name === "score" ? "Você" : "Média Geral"}
                </span>
              </div>
              <span className="text-white-1 text-xs font-bold">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardInterviewGraph() {
  return (
    <div className="card bg-bg-2 h-full flex flex-col gap-4">
      <h3 className="text-white-1 typ-h3">Performance de Entrevistas</h3>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Chart Column */}
        <div className="flex-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={true}
                horizontal={true}
              />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
                tick={({ x, y, payload, index }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="middle"
                      fill="#64748b"
                      className="font-medium text-[11px]"
                    >
                      {payload.value}
                    </text>
                    <text
                      x={0}
                      y={12}
                      dy={16}
                      textAnchor="middle"
                      fill="#475569"
                      className="text-[10px]"
                    >
                      {data[index].month}
                    </text>
                  </g>
                )}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Global Average */}
              <Line
                type="monotone"
                name="overall"
                dataKey="overall"
                stroke="#475569"
                strokeWidth={2}
                strokeDasharray="8 8"
                dot={{
                  fill: "#475569",
                  r: 0,
                  strokeWidth: 2,
                  stroke: "#1e293b",
                }}
              />
              {/* User Score */}
              <Line
                type="monotone"
                name="score"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{
                  fill: "#6366f1",
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#1e293b",
                }}
                activeDot={{ r: 7, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback Column */}
        <div className="flex-1 flex flex-col justify-center">
          <PageHeader
            title="Último Feedback da IA"
            description="Você gaguejou um pouco ao explicar Closures. Tente ser mais direto na próxima."
            type="h3"
            className="mb-4"
          />

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-4 py-2 rounded-full typ-caption border border-green/20 bg-green/5 text-green">
              Comunicação Clara
            </span>
            <span className="px-4 py-2 rounded-full typ-caption border border-yellow/20 bg-yellow/5 text-yellow">
              Gap Técnico
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
