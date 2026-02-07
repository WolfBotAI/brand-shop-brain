import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  delay?: number;
  className?: string;
}

export const ChatBubble = ({ message, delay = 0, className = "" }: ChatBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={`flex items-start gap-3 ${className}`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary-foreground" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-xs">
        <motion.p 
          className="text-sm text-card-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};
