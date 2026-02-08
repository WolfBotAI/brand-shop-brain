import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Filter, Download, Calendar } from "lucide-react";

const bestSellers = [
  { name: "Polo Shirts", sales: 2450 },
  { name: "T-Shirts", sales: 1890 },
  { name: "Hoodies", sales: 1560 },
  { name: "Caps", sales: 980 },
  { name: "Jackets", sales: 720 },
];

const marginData = [
  { name: "Apparel", value: 45, color: "hsl(var(--primary))" },
  { name: "Accessories", value: 28, color: "hsl(var(--primary) / 0.7)" },
  { name: "Promotional", value: 18, color: "hsl(var(--primary) / 0.5)" },
  { name: "Other", value: 9, color: "hsl(var(--primary) / 0.3)" },
];

const categoryBreakdown = [
  { category: "Schools", orders: 456, revenue: "$34,200", margin: "32%" },
  { category: "Churches", orders: 234, revenue: "$18,900", margin: "28%" },
  { category: "Sports Teams", orders: 312, revenue: "$27,500", margin: "35%" },
  { category: "Corporate", orders: 189, revenue: "$22,100", margin: "24%" },
];

export const KPIReportsDemo = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Demo Container */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Performance Dashboard</h3>
                <p className="text-sm text-muted-foreground">Last 30 days • All stores</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Best Sellers Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-4 rounded-xl border border-border bg-background"
              >
                <h4 className="text-sm font-medium text-foreground mb-4">Best Sellers</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bestSellers} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={80}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar 
                        dataKey="sales" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Margin Analysis Pie */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-4 rounded-xl border border-border bg-background"
              >
                <h4 className="text-sm font-medium text-foreground mb-4">Margin by Category</h4>
                <div className="flex items-center gap-4">
                  <div className="h-40 w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marginData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {marginData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {marginData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-medium text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Category Breakdown Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-xl border border-border overflow-hidden"
            >
              <div className="bg-muted px-4 py-3">
                <h4 className="text-sm font-medium text-foreground">Category Breakdown</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Category</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Orders</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Revenue</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryBreakdown.map((row, index) => (
                      <tr 
                        key={row.category} 
                        className={index !== categoryBreakdown.length - 1 ? "border-b border-border" : ""}
                      >
                        <td className="px-4 py-3 text-sm text-foreground font-medium">{row.category}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground text-right">{row.orders}</td>
                        <td className="px-4 py-3 text-sm text-foreground text-right font-medium">{row.revenue}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {row.margin}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
