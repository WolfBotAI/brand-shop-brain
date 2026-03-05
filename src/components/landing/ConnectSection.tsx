import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Phone, Eye, Globe, Bot } from "lucide-react";
import { Link } from "react-router-dom";

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
            {/* Hub Container */}
            <div className="relative w-80 h-80 mx-auto">
              {/* Connection Lines SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320" style={{ zIndex: 0 }}>
                {[{ x1: 40, y1: 40 }, { x1: 280, y1: 40 }, { x1: 40, y1: 280 }, { x1: 280, y1: 280 }].map((line, i) => (
                  <motion.line
                    key={i}
                    x1={line.x1} y1={line.y1} x2="160" y2="160"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  />
                ))}
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
                  className="flex flex-col items-center justify-center"
                >
                  <Bot className="w-8 h-8 text-primary-foreground" />
                  <span className="text-primary-foreground font-bold text-xs mt-0.5">AI Agent</span>
                </motion.div>
              </motion.div>

              {/* AI Conversations - Top Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="absolute top-0 left-0 z-10"
              >
                <div className="w-20 h-20 rounded-full bg-card border-2 border-border shadow-md flex flex-col items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="text-[9px] font-bold text-foreground mt-0.5 leading-tight text-center">AI Support Agent</span>
                  <span className="text-[7px] text-muted-foreground leading-tight text-center">Web · SMS · Email · FB · IG</span>
                </div>
              </motion.div>

              {/* AI Voice - Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="absolute top-0 right-0 z-10"
              >
                <div className="w-20 h-20 rounded-full bg-card border-2 border-border shadow-md flex flex-col items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-[9px] font-bold text-foreground mt-0.5">AI Voice</span>
                  <span className="text-[7px] text-muted-foreground">Phone Calls</span>
                </div>
              </motion.div>

              {/* AI Vision - Bottom Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="absolute bottom-0 left-0 z-10"
              >
                <div className="w-20 h-20 rounded-full bg-card border-2 border-border shadow-md flex flex-col items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                  <span className="text-[9px] font-bold text-foreground mt-0.5">AI Vision</span>
                  <span className="text-[7px] text-muted-foreground">PO Extraction</span>
                </div>
              </motion.div>

              {/* AI Web Widget - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="absolute bottom-0 right-0 z-10"
              >
                <div className="w-20 h-20 rounded-full bg-card border-2 border-border shadow-md flex flex-col items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-[9px] font-bold text-foreground mt-0.5">AI Web Widget</span>
                  <span className="text-[7px] text-muted-foreground">Embed on Any Site</span>
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
              AI Support, Voice, and Vision handle every customer interaction 
              across every channel — 24/7.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "AI Support Agent handles web chat, SMS, email, Facebook & Instagram",
                "AI Voice takes phone calls with real-time order lookups",
                "AI Vision reads POs, PDFs, and handwritten notes automatically",
                "Our certified decorator network ensures quality and tracking",
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
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
            >
              <Link to="/features/ai-support">
                See It In Action
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
