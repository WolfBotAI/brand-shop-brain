import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Smartphone, Mail, MessageCircle, Camera, Phone, Eye, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const channels = [
  { icon: MessageSquare, label: "Web Chat" },
  { icon: Smartphone, label: "SMS" },
  { icon: Mail, label: "Email" },
  { icon: MessageCircle, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: Phone, label: "Phone" },
  { icon: Eye, label: "PO Vision" },
];

const SIZE = 380;
const CENTER = SIZE / 2;
const RADIUS = 145;
const NODE_R = 28;

export const ConnectSection = () => {
  return (
    <section className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Radial Hub Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center justify-center"
          >
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="w-full max-w-[420px] h-auto"
              style={{ overflow: "visible" }}
            >
              {/* Connection lines */}
              {channels.map((_, i) => {
                const angle = (2 * Math.PI * i) / channels.length - Math.PI / 2;
                const x = CENTER + RADIUS * Math.cos(angle);
                const y = CENTER + RADIUS * Math.sin(angle);
                return (
                  <motion.line
                    key={`line-${i}`}
                    x1={CENTER}
                    y1={CENTER}
                    x2={x}
                    y2={y}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.45 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.08 }}
                  />
                );
              })}

              {/* Pulsing outer ring */}
              <motion.circle
                cx={CENTER}
                cy={CENTER}
                r={52}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              />
              <motion.circle
                cx={CENTER}
                cy={CENTER}
                r={52}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity={0.3}
                animate={{ r: [52, 62, 52], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Center hub background */}
              <motion.circle
                cx={CENTER}
                cy={CENTER}
                r={46}
                fill="hsl(var(--primary))"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              />

              {/* Center hub content */}
              <motion.g
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <Bot
                  x={CENTER - 14}
                  y={CENTER - 18}
                  width={28}
                  height={28}
                  className="text-primary-foreground"
                  stroke="hsl(var(--primary-foreground))"
                />
                <text
                  x={CENTER}
                  y={CENTER + 22}
                  textAnchor="middle"
                  fill="hsl(var(--primary-foreground))"
                  fontSize="10"
                  fontWeight="700"
                >
                  One Brain
                </text>
              </motion.g>

              {/* Satellite nodes */}
              {channels.map((channel, i) => {
                const angle = (2 * Math.PI * i) / channels.length - Math.PI / 2;
                const x = CENTER + RADIUS * Math.cos(angle);
                const y = CENTER + RADIUS * Math.sin(angle);
                const Icon = channel.icon;
                return (
                  <motion.g
                    key={`node-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.5 + i * 0.08 }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={NODE_R}
                      fill="hsl(var(--card))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <Icon
                      x={x - 10}
                      y={y - 10}
                      width={20}
                      height={20}
                      stroke="hsl(var(--primary))"
                    />
                    <text
                      x={x}
                      y={y + NODE_R + 14}
                      textAnchor="middle"
                      fill="hsl(var(--foreground))"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {channel.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
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
