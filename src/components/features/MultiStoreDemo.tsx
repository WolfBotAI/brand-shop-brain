import { motion } from "framer-motion";
import { Store, Settings, BarChart3, Eye, MoreHorizontal } from "lucide-react";

const stores = [
  { name: "Westside High School", status: "active", orders: 156, revenue: "$12,450" },
  { name: "First Baptist Church", status: "active", orders: 89, revenue: "$7,230" },
  { name: "Metro Fire Dept", status: "pending", orders: 23, revenue: "$3,100" },
  { name: "City Youth League", status: "active", orders: 67, revenue: "$5,890" },
  { name: "Oak Valley Elementary", status: "active", orders: 112, revenue: "$9,870" },
  { name: "Community Center", status: "migrating", orders: 0, revenue: "$0" },
];

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  pending: "bg-yellow-500",
  migrating: "bg-blue-500",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  pending: "Pending Setup",
  migrating: "Migrating",
};

export const MultiStoreDemo = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Demo Container */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">All Client Stores</h3>
                <p className="text-sm text-muted-foreground">6 stores managed</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                  + New Store
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm">
                  Bulk Actions
                </div>
              </div>
            </div>

            {/* Store Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store, index) => (
                <motion.div
                  key={store.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group rounded-xl border border-border bg-background p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Store Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Store className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{store.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className={`w-2 h-2 rounded-full ${statusColors[store.status]}`} />
                          <span className="text-xs text-muted-foreground">{statusLabels[store.status]}</span>
                        </div>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Store Stats */}
                  {store.status === "active" && (
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Orders: </span>
                        <span className="font-medium text-foreground">{store.orders}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-medium text-foreground">{store.revenue}</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:bg-muted transition-colors">
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:bg-muted transition-colors">
                      <Settings className="w-3 h-3" />
                      Settings
                    </button>
                    <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:bg-muted transition-colors">
                      <BarChart3 className="w-3 h-3" />
                      Analytics
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
