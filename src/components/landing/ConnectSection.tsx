import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MessageCircle, Share2, Smartphone, Bot } from "lucide-react";

const channels = [
  { icon: Mail, label: "Email", position: "top-left" },
  { icon: MessageCircle, label: "Chat", position: "top-right" },
  { icon: Share2, label: "Social", position: "bottom-left" },
  { icon: Smartphone, label: "SMS", position: "bottom-right" },
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
            {/* Hub Container - Grid Layout */}
            <div className="relative w-80 h-80 mx-auto">
              {/* Connection Lines SVG - Behind everything */}
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 320 320"
                style={{ zIndex: 0 }}
              >
                {/* Top-left line (Email to Center) */}
                <motion.line
                  x1="64" y1="64"
                  x2="160" y2="160"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                {/* Top-right line (Chat to Center) */}
                <motion.line
                  x1="256" y1="64"
                  x2="160" y2="160"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
                {/* Bottom-left line (Social to Center) */}
                <motion.line
                  x1="64" y1="256"
                  x2="160" y2="160"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
                {/* Bottom-right line (SMS to Center) */}
                <motion.line
                  x1="256" y1="256"
                  x2="160" y2="160"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </svg>

              {/* Center AI Agent Hub */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg z-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-center"
                >
                  <Bot className="w-8 h-8 text-primary-foreground mx-auto mb-1" />
                  <span className="text-primary-foreground font-bold text-xs">AI Agent</span>
                </motion.div>
              </motion.div>

              {/* Email - Top Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="absolute top-0 left-0 z-10"
              >
                <div className="w-16 h-16 rounded-full bg-card border-2 border-border shadow-md flex flex-col items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                  <span className="text-[10px] text-muted-foreground mt-1">Email</span>
                </div>
              </motion.div>

              {/* Chat - Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="absolute top-0 right-0 z-10"
              >
                <div className="w-16 h-16 rounded-full bg-card border-2 border-border shadow-md flex flex-col items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <span className="text-[10px] text-muted-foreground mt-1">Chat</span>
                </div>
              </motion.div>

              {/* Social - Bottom Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="absolute bottom-0 left-0 z-10"
              >
                <div className="w-16 h-16 rounded-full bg-card border-2 border-border shadow-md flex flex-col items-center justify-center">
                  <Share2 className="w-6 h-6 text-primary" />
                  <span className="text-[10px] text-muted-foreground mt-1">Social</span>
                </div>
              </motion.div>

              {/* SMS - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="absolute bottom-0 right-0 z-10"
              >
                <div className="w-16 h-16 rounded-full bg-card border-2 border-border shadow-md flex flex-col items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                  <span className="text-[10px] text-muted-foreground mt-1">SMS</span>
                </div>
              </motion.div>
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
