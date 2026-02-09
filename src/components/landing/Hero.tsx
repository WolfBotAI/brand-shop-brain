import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Users, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-muted"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">For Apparel Distributors</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Give Your Clients{" "}
              <span className="text-primary">AI-Powered Stores</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              Let schools, churches, and brands build stores themselves — guided by AI 
              or from themes you pre-select. Zero support burden for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
              >
                See How It Works
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-foreground/50 text-foreground hover:bg-foreground/10"
              >
                Book a Demo
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: "24/7", label: "AI Support" },
                { value: "100%", label: "Autopilot" },
                { value: "0", label: "Support Tickets" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Dashboard mockup */}
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-primary/50" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                </div>
                <span className="text-sm text-muted-foreground">Distributor Dashboard</span>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-foreground">Your Client Stores</h3>
                  <span className="text-sm text-primary">12 Active</span>
                </div>
                
                {/* Client store cards */}
                <div className="space-y-3">
                  {[
                    { name: "Lincoln High School", orders: 45, status: "Active" },
                    { name: "Grace Community Church", orders: 28, status: "Active" },
                    { name: "TechCorp Inc.", orders: 156, status: "Active" },
                  ].map((client, index) => (
                    <motion.div
                      key={client.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-muted rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Store className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{client.name}</p>
                          <p className="text-xs text-muted-foreground">{client.orders} orders this month</p>
                        </div>
                      </div>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {client.status}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* AI indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="mt-6 flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">AI handling 47 conversations</p>
                    <p className="text-xs text-muted-foreground">Across all client stores</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
