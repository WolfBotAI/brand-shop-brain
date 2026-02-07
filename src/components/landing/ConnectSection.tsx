import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MessageCircle, Share2, Smartphone, Bot } from "lucide-react";

const channels = [
  { icon: Mail, label: "Email" },
  { icon: MessageCircle, label: "Chat" },
  { icon: Share2, label: "Social" },
  { icon: Smartphone, label: "SMS" },
];

export const ConnectSection = () => {
  return (
    <section className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Central hub */}
            <div className="relative w-80 h-80 mx-auto">
              {/* Center circle */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-primary flex items-center justify-center shadow-lg"
              >
                <div className="text-center">
                  <Bot className="w-8 h-8 text-primary-foreground mx-auto mb-1" />
                  <span className="text-primary-foreground font-bold text-xs">
                    AI Agent
                  </span>
                </div>
              </motion.div>

              {/* Channel icons orbiting */}
              {channels.map((channel, index) => {
                const Icon = channel.icon;
                const angle = (index * 90) - 45;
                const radius = 120;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <motion.div
                    key={channel.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                  >
                    <div className="w-16 h-16 rounded-full bg-card border-2 border-border shadow-md flex flex-col items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="text-[10px] text-muted-foreground mt-1">{channel.label}</span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320">
                {channels.map((_, index) => {
                  const angle = (index * 90) - 45;
                  const radius = 100;
                  const x = 160 + Math.cos((angle * Math.PI) / 180) * radius;
                  const y = 160 + Math.sin((angle * Math.PI) / 180) * radius;
                  return (
                    <motion.line
                      key={index}
                      x1="160"
                      y1="160"
                      x2={x}
                      y2={y}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.3 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    />
                  );
                })}
              </svg>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your Clients Get White-Glove Service.{" "}
              <span className="text-primary">You Do Nothing.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              AI agents handle all customer interactions across every channel. 
              Your clients feel supported 24/7 — you never lift a finger.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Order tracking, returns, and billing updates — all automated",
                "Private catalogs with AI navigation",
                "Proactive engagement via Email, Chat, Social, and SMS",
                "Clients feel supported 24/7, you scale without hiring",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </motion.li>
              ))}
            </ul>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
            >
              See It In Action
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
