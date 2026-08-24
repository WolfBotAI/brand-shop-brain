import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Store,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Wifi,
  WifiOff,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardSummary, fetchIntegrationStatus } from "@/lib/api/dashboard";
import { SEO } from "@/components/seo/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07 } }),
};

export default function Dashboard() {
  const summary = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: fetchDashboardSummary,
    retry: 1,
  });

  const integrations = useQuery({
    queryKey: ["integrations-status"],
    queryFn: fetchIntegrationStatus,
    retry: 1,
  });

  const data = summary.data;
  const isLoading = summary.isLoading;

  const kpis = [
    { label: "Active Stores", value: data?.activeStores ?? "—", icon: Store, color: "text-accent" },
    { label: "Total Orders", value: data?.totalOrders ?? "—", icon: ShoppingCart, color: "text-primary" },
    {
      label: "Revenue",
      value: data?.totalRevenue != null ? `$${data.totalRevenue.toLocaleString()}` : "—",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      label: "Avg Order",
      value: data?.avgOrderValue != null ? `$${data.avgOrderValue.toFixed(2)}` : "—",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <SEO title="Dashboard | Brand-Shop.AI" description="Your Brand-Shop.AI distributor dashboard: store activity, order volume, and integration status at a glance." path="/app/dashboard" noIndex />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back. Here's how your stores are performing.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={i}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-card-foreground">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Assistant Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Merch Advisor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {data?.activeStores === 0 || !data ? (
                <p className="text-muted-foreground">
                  Get started by completing onboarding to activate your catalog and launch your first store.
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    You have <strong className="text-foreground">{data.activeStores}</strong> active
                    stores. Consider syncing catalogs for stores missing product images.
                  </p>
                  <p className="text-muted-foreground">
                    Revenue trend is positive — explore pricing rules to optimize margins.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : data?.recentActivity?.length ? (
                <div className="space-y-3">
                  {data.recentActivity.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="text-card-foreground">{event.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No recent activity. Launch a store to get started.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Integration Health */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Integration Health</CardTitle>
          </CardHeader>
          <CardContent>
            {integrations.isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : integrations.data?.integrations?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(() => {
                const nameMap: Record<string, string> = {
                  SSActivewear: "Brand-Shop Catalog",
                  SanMar: "Brand-Shop Catalog",
                  Printful: "Brand-Shop Fulfillment",
                };
                const seen = new Set<string>();
                return integrations.data.integrations
                  .map((intg) => {
                    const displayName = nameMap[intg.name] || intg.name;
                    if (seen.has(displayName)) return null;
                    seen.add(displayName);
                    const displayStatus = (intg.status as string) === "Handled-In-Ghl" ? "active" : intg.status;
                    return (
                      <div key={displayName} className="flex items-center gap-2 rounded-lg border border-border p-3">
                        {displayStatus === "connected" || displayStatus === "active" ? (
                          <Wifi className="h-4 w-4 text-accent" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{displayName}</p>
                          <p className="text-xs text-muted-foreground capitalize">{displayStatus}</p>
                        </div>
                      </div>
                    );
                  })
                  .filter(Boolean);
              })()}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No integrations configured yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Store Performance */}
      {data?.storePerformance?.length ? (
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Store Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border">
                      <th className="pb-2 font-medium">Store</th>
                      <th className="pb-2 font-medium">Revenue</th>
                      <th className="pb-2 font-medium">Orders</th>
                      <th className="pb-2 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.storePerformance.map((store) => (
                      <tr key={store.storeId} className="border-b border-border/50 last:border-0">
                        <td className="py-2.5 font-medium text-card-foreground">{store.storeName}</td>
                        <td className="py-2.5 text-card-foreground">${store.revenue.toLocaleString()}</td>
                        <td className="py-2.5 text-card-foreground">{store.orders}</td>
                        <td className="py-2.5">
                          <span className={store.change >= 0 ? "text-accent" : "text-destructive"}>
                            {store.change >= 0 ? "+" : ""}
                            {store.change}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}
