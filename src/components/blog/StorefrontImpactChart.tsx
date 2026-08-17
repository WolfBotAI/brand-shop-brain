import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";

const TRADITIONAL = "#9ca3af";
const AI_COLOR = "hsl(var(--primary))";

interface MiniChart {
  title: string;
  data: { name: string; value: number; label: string; fill: string }[];
  domainMax: number;
}

const charts: MiniChart[] = [
  {
    title: "Time to first mockup",
    domainMax: 44,
    data: [
      { name: "Traditional", value: 36, label: "36h", fill: TRADITIONAL },
      { name: "AI designer", value: 0.02, label: "<1 min", fill: AI_COLOR },
    ],
  },
  {
    title: "Storefront conversion rate",
    domainMax: 5,
    data: [
      { name: "Traditional", value: 1.8, label: "1.8%", fill: TRADITIONAL },
      { name: "AI designer", value: 3.9, label: "3.9%", fill: AI_COLOR },
    ],
  },
  {
    title: "Art-department hours per 100 orders",
    domainMax: 50,
    data: [
      { name: "Traditional", value: 40, label: "40", fill: TRADITIONAL },
      { name: "AI designer", value: 9, label: "9", fill: AI_COLOR },
    ],
  },
];

export const StorefrontImpactChart = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {charts.map((chart) => (
          <div key={chart.title}>
            <p className="text-sm font-semibold text-foreground mb-3 text-center min-h-[2.5rem]">{chart.title}</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart.data} margin={{ top: 20, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis hide domain={[0, chart.domainMax]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={44} isAnimationActive={false}>
                    {chart.data.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="label"
                      position="top"
                      style={{ fontSize: 12, fontWeight: 600, fill: "hsl(var(--foreground))" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: TRADITIONAL }} />
          Traditional storefront
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
          AI product designer
        </span>
      </div>
    </div>
  );
};
