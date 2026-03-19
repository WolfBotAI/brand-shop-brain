import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, TrendingUp, ShoppingCart, DollarSign, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { format, subDays, isAfter, parseISO } from "date-fns";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 220 70% 50%))",
  "hsl(var(--chart-3, 340 75% 55%))",
  "hsl(var(--chart-4, 160 60% 45%))",
  "hsl(var(--chart-5, 30 80% 55%))",
];

type DateRange = "7d" | "30d" | "90d" | "all";

export default function Reporting() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [storeFilter, setStoreFilter] = useState<string>("all");

  const { data: stores } = useQuery({
    queryKey: ["reporting-stores"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stores").select("id, store_name").order("store_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["reporting-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    let filtered = orders;
    if (dateRange !== "all") {
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
      const cutoff = subDays(new Date(), days);
      filtered = filtered.filter((o) => isAfter(parseISO(o.created_at), cutoff));
    }
    if (storeFilter !== "all") {
      filtered = filtered.filter((o) => o.store_id === storeFilter);
    }
    return filtered;
  }, [orders, dateRange, storeFilter]);

  const totalRevenue = filteredOrders.reduce((s, o) => s + Number(o.total), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Revenue over time (grouped by day)
  const revenueByDay = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const day = format(parseISO(o.created_at), "MMM dd");
      map[day] = (map[day] || 0) + Number(o.total);
    });
    return Object.entries(map).map(([date, revenue]) => ({ date, revenue: +revenue.toFixed(2) }));
  }, [filteredOrders]);

  // Orders by store
  const ordersByStore = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    filteredOrders.forEach((o) => {
      const name = stores?.find((s) => s.id === o.store_id)?.store_name || "Unknown";
      if (!map[name]) map[name] = { count: 0, revenue: 0 };
      map[name].count++;
      map[name].revenue += Number(o.total);
    });
    return Object.entries(map).map(([store, data]) => ({ store, ...data }));
  }, [filteredOrders, stores]);

  // Top products
  const topProducts = useMemo(() => {
    const map: Record<string, { qty: number; revenue: number }> = {};
    filteredOrders.forEach((o) => {
      const items = (o.items as any[]) || [];
      items.forEach((item: any) => {
        const title = item.title || "Unknown";
        if (!map[title]) map[title] = { qty: 0, revenue: 0 };
        map[title].qty += item.qty || 1;
        map[title].revenue += (item.price || 0) * (item.qty || 1);
      });
    });
    return Object.entries(map)
      .map(([name, data]) => ({ name: name.length > 20 ? name.slice(0, 20) + "…" : name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [filteredOrders]);

  // Status breakdown for pie
  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--primary))" },
    count: { label: "Orders", color: "hsl(var(--primary))" },
    qty: { label: "Qty Sold", color: "hsl(var(--primary))" },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reporting</h1>
          <p className="text-muted-foreground text-sm">Revenue, orders, and product insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={storeFilter} onValueChange={setStoreFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Stores" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {stores?.map((s) => <SelectItem key={s.id} value={s.id}>{s.store_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10"><ShoppingCart className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10"><TrendingUp className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Revenue over time */}
            <Card>
              <CardHeader><CardTitle className="text-base">Revenue Over Time</CardTitle></CardHeader>
              <CardContent>
                {revenueByDay.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No data for this period</p>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <LineChart data={revenueByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={11} />
                      <YAxis fontSize={11} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Orders by store */}
            <Card>
              <CardHeader><CardTitle className="text-base">Orders by Store</CardTitle></CardHeader>
              <CardContent>
                {ordersByStore.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No data</p>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <BarChart data={ordersByStore}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="store" fontSize={11} />
                      <YAxis fontSize={11} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader><CardTitle className="text-base">Top Products by Revenue</CardTitle></CardHeader>
              <CardContent>
                {topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No data</p>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <BarChart data={topProducts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" fontSize={11} />
                      <YAxis dataKey="name" type="category" width={100} fontSize={10} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Order Status Breakdown */}
            <Card>
              <CardHeader><CardTitle className="text-base">Order Status</CardTitle></CardHeader>
              <CardContent>
                {statusBreakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No data</p>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <PieChart>
                      <Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {statusBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
