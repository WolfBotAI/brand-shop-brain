import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Store,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12400, orders: 89 },
  { month: "Feb", revenue: 15600, orders: 112 },
  { month: "Mar", revenue: 18200, orders: 134 },
  { month: "Apr", revenue: 21500, orders: 156 },
  { month: "May", revenue: 19800, orders: 142 },
  { month: "Jun", revenue: 24600, orders: 178 },
];

const storePerformance = [
  { name: "Lincoln High", revenue: 8420, orders: 62, change: 12.5 },
  { name: "Grace Church", revenue: 6280, orders: 45, change: -3.2 },
  { name: "TechCorp Inc", revenue: 5840, orders: 38, change: 8.7 },
  { name: "Oak Elementary", revenue: 4120, orders: 31, change: 15.3 },
];

const orderDistribution = [
  { name: "T-Shirts", value: 45, color: "hsl(var(--primary))" },
  { name: "Hoodies", value: 25, color: "hsl(var(--primary) / 0.7)" },
  { name: "Hats", value: 15, color: "hsl(var(--primary) / 0.5)" },
  { name: "Other", value: 15, color: "hsl(var(--primary) / 0.3)" },
];

const metricCards = [
  { 
    label: "Total Revenue", 
    value: "$112,240", 
    change: "+12.5%", 
    trend: "up",
    icon: DollarSign 
  },
  { 
    label: "Total Orders", 
    value: "811", 
    change: "+8.3%", 
    trend: "up",
    icon: ShoppingCart 
  },
  { 
    label: "Active Stores", 
    value: "24", 
    change: "+2", 
    trend: "up",
    icon: Store 
  },
  { 
    label: "Avg Order Value", 
    value: "$138.40", 
    change: "+4.2%", 
    trend: "up",
    icon: TrendingUp 
  },
];

export const DashboardDemo = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "stores" | "products">("overview");

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real-Time Business Intelligence
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See revenue, orders, and store performance at a glance. Make data-driven decisions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Dashboard Frame */}
          <motion.div 
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Dashboard Header */}
            <div className="bg-muted px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="font-semibold text-card-foreground">Distributor Dashboard</span>
              </div>
              <div className="flex gap-2">
                {["overview", "stores", "products"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-background"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {metricCards.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="bg-muted rounded-xl p-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <metric.icon className="w-5 h-5 text-muted-foreground" />
                      <span className={`text-xs font-medium flex items-center gap-0.5 ${
                        metric.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}>
                        {metric.trend === "up" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {metric.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-card-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="md:col-span-2 bg-muted rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-card-foreground mb-4">Revenue Over Time</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <YAxis 
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          axisLine={{ stroke: "hsl(var(--border))" }}
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
                          activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Order Distribution */}
                <div className="bg-muted rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-card-foreground mb-4">Order Distribution</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderDistribution}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {orderDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                          formatter={(value: number) => [`${value}%`, ""]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {orderDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="text-card-foreground font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Store Performance Table */}
              <div className="mt-6 bg-muted rounded-xl p-4">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Store Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground border-b border-border">
                        <th className="pb-3 font-medium">Store</th>
                        <th className="pb-3 font-medium">Revenue</th>
                        <th className="pb-3 font-medium">Orders</th>
                        <th className="pb-3 font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storePerformance.map((store, index) => (
                        <motion.tr 
                          key={store.name}
                          className="border-b border-border/50 last:border-0"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td className="py-3 text-sm text-card-foreground font-medium">{store.name}</td>
                          <td className="py-3 text-sm text-card-foreground">${store.revenue.toLocaleString()}</td>
                          <td className="py-3 text-sm text-card-foreground">{store.orders}</td>
                          <td className="py-3">
                            <span className={`text-sm font-medium flex items-center gap-0.5 ${
                              store.change > 0 ? "text-green-500" : "text-red-500"
                            }`}>
                              {store.change > 0 ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {Math.abs(store.change)}%
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
