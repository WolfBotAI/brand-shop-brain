import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Loader2, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatBubbleProps {
  message: string;
  delay?: number;
  className?: string;
  /** When provided, enables interactive mode with AI chat */
  stepContext?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

type Msg = { role: "user" | "assistant"; content: string };

export const ChatBubble = ({ message, delay = 0, className = "", stepContext }: ChatBubbleProps) => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          storeName: "Brand-Shop Onboarding",
          products: [],
          systemContext: stepContext || "You are an AI assistant helping a distributor set up their Brand-Shop apparel store. Be helpful, concise, and proactive.",
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("AI chat failed");
      }

      // Handle streaming
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              const finalContent = assistantContent;
              setMessages((prev) =>
                prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: finalContent } : m))
              );
            }
          } catch {
            // partial JSON
          }
        }
      }

      // If no streaming content, try non-streaming fallback
      if (!assistantContent) {
        // The response may have been non-streaming JSON
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) {
            return prev.slice(0, -1).concat({ role: "assistant", content: "I'm here to help! What would you like to know about setting up your store?" });
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("AI chat error:", e);
      setMessages((prev) => [
        ...prev.filter((m) => !(m.role === "assistant" && !m.content)),
        { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Static mode (no stepContext)
  if (!stepContext) {
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
          <p className="text-sm text-card-foreground">{message}</p>
        </div>
      </motion.div>
    );
  }

  // Interactive mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`${className}`}
    >
      {/* Collapsed view */}
      {!expanded ? (
        <div
          className="flex items-start gap-3 cursor-pointer group"
          onClick={() => setExpanded(true)}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-md">
            <p className="text-sm text-card-foreground">{message}</p>
            <p className="text-[10px] text-primary mt-1.5 group-hover:underline flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Ask me anything about this step
            </p>
          </div>
        </div>
      ) : (
        /* Expanded chat panel */
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-primary/5 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-foreground">Brand-Shop AI Assistant</span>
            </div>
            <button onClick={() => setExpanded(false)} className="p-1 rounded-full hover:bg-muted transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="max-h-64 overflow-y-auto p-3 space-y-3">
            {/* Initial context message */}
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-3 h-3 text-primary" />
              </div>
              <div className="bg-muted/50 rounded-lg rounded-tl-sm px-3 py-2 max-w-[85%]">
                <p className="text-xs text-foreground">{message}</p>
              </div>
            </div>

            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-3 py-2 max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/50 text-foreground rounded-tl-sm"
                  }`}
                >
                  <p className="text-xs whitespace-pre-wrap">{msg.content || "..."}</p>
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                </div>
                <span className="text-[10px] text-muted-foreground">Thinking...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-t border-border">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about this step..."
              className="h-8 text-xs flex-1"
              disabled={loading}
            />
            <Button
              size="sm"
              className="h-8 w-8 p-0"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
