import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Building2, Trophy, Megaphone, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const eventTypes = [
  { icon: GraduationCap, label: "Fundraisers" },
  { icon: Building2, label: "Corporate" },
  { icon: Trophy, label: "Team Sports" },
  { icon: Megaphone, label: "Campaigns" },
];

export const PopUpStoresSection = () => {
  return (
    <section className="py-24 bg-[hsl(var(--section-dark))]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Pop-Up Stores</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--section-dark-foreground))] mb-6">
              Pop-Up Stores for{" "}
              <span className="text-primary">Any Event</span>
            </h2>
            <p className="text-xl text-[hsl(var(--section-dark-foreground))]/70 mb-8 max-w-xl">
              Fundraisers, team events, campaigns — launch a branded store in minutes. 
              Set it and forget it. When the event ends, customers are redirected to the main store.
            </p>

            {/* Event type pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {eventTypes.map((event, i) => (
                <motion.div
                  key={event.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-2 bg-[hsl(var(--section-dark-foreground))]/10 px-4 py-2.5 rounded-full"
                >
                  <event.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-[hsl(var(--section-dark-foreground))]">{event.label}</span>
                </motion.div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
            >
              <Link to="/features/popup-stores">
                Explore pop-up store features
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Right - Visual mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="bg-muted px-5 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                </div>
                <span className="text-xs text-muted-foreground">Pop-Up Store Builder</span>
              </div>
              <div className="p-6 space-y-4">
                {/* Event type selector */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Event Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {eventTypes.map((event, i) => (
                      <motion.div
                        key={event.label}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className={`p-3 rounded-lg border text-center text-sm font-medium ${
                          i === 0 ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground"
                        }`}
                      >
                        <event.icon className="w-5 h-5 mx-auto mb-1" />
                        {event.label}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Date range */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="flex gap-3"
                >
                  <div className="flex-1 p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-muted-foreground mb-1">Start</p>
                    <p className="text-sm font-medium text-foreground">Mar 15, 2026</p>
                  </div>
                  <div className="flex-1 p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-muted-foreground mb-1">End</p>
                    <p className="text-sm font-medium text-foreground">Apr 15, 2026</p>
                  </div>
                </motion.div>

                {/* Launch button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="bg-primary text-primary-foreground text-center py-3 rounded-lg font-medium text-sm"
                >
                  🚀 Launch Pop-Up Store
                </motion.div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-foreground text-background px-5 py-3 rounded-xl shadow-lg"
            >
              <p className="text-sm font-bold">Auto-Expires</p>
              <p className="text-xs opacity-80">Redirects to main store</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
