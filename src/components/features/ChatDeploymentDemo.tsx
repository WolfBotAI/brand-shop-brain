import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  MessageCircle,
  Brain,
  Globe,
  Code,
  Package,
  Truck
} from "lucide-react";
import { ChatBubble } from "./ChatBubble";

const channels = [
  { id: "chat", icon: MessageSquare, label: "Web Chat", color: "bg-blue-500" },
  { id: "phone", icon: Phone, label: "Phone", color: "bg-green-500" },
  { id: "email", icon: Mail, label: "Email", color: "bg-purple-500" },
  { id: "sms", icon: MessageCircle, label: "SMS", color: "bg-orange-500" },
];

const websiteTypes = [
  { id: "school", label: "Lincoln High School", url: "lincolnhs.edu/store" },
  { id: "church", label: "Grace Community Church", url: "gracecc.org/shop" },
  { id: "business", label: "TechCorp Inc", url: "techcorp.com/merch" },
];

const chatMessages = [
  { sender: "customer", text: "Hi, where's my order #12345?" },
  { sender: "ai", text: "Let me check that for you..." },
  { sender: "ai", text: "Your order #12345 shipped yesterday via UPS. It's scheduled to arrive Friday, March 15th." },
  { sender: "customer", text: "Can I change the delivery address?" },
  { sender: "ai", text: "I can help with that! The package is currently in transit. I'll contact UPS to request an address change. What's the new address?" },
];

type DemoPhase = "embed" | "unified" | "conversation";

export const ChatDeploymentDemo = () => {
  const [phase, setPhase] = useState<DemoPhase>("embed");
  const [activeWebsite, setActiveWebsite] = useState(0);
  const [activeChannel, setActiveChannel] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Auto-play demo
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Phase 1: Embed demo
    timers.push(setTimeout(() => setActiveWebsite(1), 1500));
    timers.push(setTimeout(() => setActiveWebsite(2), 3000));
    timers.push(setTimeout(() => setActiveWebsite(0), 4500));
    
    // Phase 2: Unified brain
    timers.push(setTimeout(() => setPhase("unified"), 6000));
    timers.push(setTimeout(() => setActiveChannel(1), 7000));
    timers.push(setTimeout(() => setActiveChannel(2), 8000));
    timers.push(setTimeout(() => setActiveChannel(3), 9000));
    timers.push(setTimeout(() => setActiveChannel(0), 10000));
    
    // Phase 3: Conversation
    timers.push(setTimeout(() => setPhase("conversation"), 11500));
    
    // Show messages one by one
    timers.push(setTimeout(() => setVisibleMessages(1), 12500));
    timers.push(setTimeout(() => setIsLookingUp(true), 13500));
    timers.push(setTimeout(() => {
      setIsLookingUp(false);
      setVisibleMessages(2);
    }, 14500));
    timers.push(setTimeout(() => setVisibleMessages(3), 15500));
    timers.push(setTimeout(() => setVisibleMessages(4), 17000));
    timers.push(setTimeout(() => setVisibleMessages(5), 18500));
    
    // Reset
    timers.push(setTimeout(() => {
      setPhase("embed");
      setActiveWebsite(0);
      setActiveChannel(0);
      setVisibleMessages(0);
      setIsLookingUp(false);
    }, 22000));

    return () => timers.forEach(clearTimeout);
  }, [phase === "embed"]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Deploy AI Support Anywhere
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            One AI brain that works across every channel. Embed on any website in minutes.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Phase tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[
              { id: "embed", label: "Embed Anywhere" },
              { id: "unified", label: "Unified Brain" },
              { id: "conversation", label: "Live Demo" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPhase(tab.id as DemoPhase)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  phase === tab.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* Embed Phase */}
              {phase === "embed" && (
                <motion.div
                  key="embed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="Add our AI support widget to any website with a single line of code." />
                  
                  {/* Website mockups */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {websiteTypes.map((site, index) => (
                      <motion.div
                        key={site.id}
                        className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                          activeWebsite === index 
                            ? "border-primary shadow-lg scale-105" 
                            : "border-border"
                        }`}
                        animate={{ 
                          scale: activeWebsite === index ? 1.02 : 1 
                        }}
                      >
                        {/* Browser chrome */}
                        <div className="bg-muted px-3 py-2 flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                          </div>
                          <div className="flex-1 bg-background rounded px-2 py-0.5 text-xs text-muted-foreground truncate">
                            {site.url}
                          </div>
                        </div>
                        
                        {/* Website content */}
                        <div className="bg-background p-4 h-40 relative">
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                          </div>
                          
                          {/* Chat widget */}
                          <motion.div
                            className="absolute bottom-3 right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"
                            animate={{ 
                              scale: activeWebsite === index ? [1, 1.1, 1] : 1 
                            }}
                            transition={{ duration: 0.5, repeat: activeWebsite === index ? Infinity : 0 }}
                          >
                            <MessageSquare className="w-5 h-5 text-primary-foreground" />
                          </motion.div>
                        </div>
                        
                        <div className="bg-muted px-3 py-2">
                          <p className="text-xs font-medium text-center text-muted-foreground">{site.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Code snippet */}
                  <motion.div 
                    className="bg-secondary rounded-xl p-4 overflow-x-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-secondary-foreground">Simple Integration</span>
                    </div>
                    <code className="text-sm text-primary font-mono">
                      {'<script src="https://brandshop.ai/widget.js" data-store="YOUR_ID"></script>'}
                    </code>
                  </motion.div>
                </motion.div>
              )}

              {/* Unified Brain Phase */}
              {phase === "unified" && (
                <motion.div
                  key="unified"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="One AI brain powers every channel. Same knowledge, same memory, everywhere." />
                  
                  <div className="flex flex-col items-center py-8">
                    {/* Channels flowing to brain */}
                    <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
                      {channels.map((channel, index) => (
                        <motion.div
                          key={channel.id}
                          className="flex flex-col items-center gap-2"
                          animate={{
                            scale: activeChannel === index ? 1.2 : 1,
                            y: activeChannel === index ? -10 : 0
                          }}
                        >
                          <div className={`w-14 h-14 rounded-full ${channel.color} flex items-center justify-center`}>
                            <channel.icon className="w-7 h-7 text-white" />
                          </div>
                          <span className="text-sm font-medium text-card-foreground">{channel.label}</span>
                          
                          {/* Connection line */}
                          <motion.div
                            className="w-0.5 h-12 bg-muted"
                            animate={{
                              backgroundColor: activeChannel === index ? "hsl(var(--primary))" : "hsl(var(--muted))"
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Central brain */}
                    <motion.div
                      className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-xl"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Brain className="w-12 h-12 text-primary-foreground" />
                    </motion.div>
                    
                    <p className="mt-6 text-center text-muted-foreground max-w-md">
                      Customer starts on chat, continues on phone — the AI remembers everything. 
                      No repetition, no frustration.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Conversation Phase */}
              {phase === "conversation" && (
                <motion.div
                  key="conversation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="Watch the AI handle a real customer inquiry with order lookup." />
                  
                  <div className="max-w-md mx-auto bg-muted rounded-xl overflow-hidden">
                    {/* Chat header */}
                    <div className="bg-primary px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-foreground">Brand-Shop.AI Support</p>
                        <p className="text-xs text-primary-foreground/70">Powered by AI</p>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="p-4 space-y-4 min-h-[300px]">
                      {chatMessages.slice(0, visibleMessages).map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                            msg.sender === "customer"
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-background text-card-foreground rounded-bl-sm"
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Lookup indicator */}
                      {isLookingUp && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="flex items-center gap-1 px-3 py-2 bg-background rounded-lg">
                            <Package className="w-4 h-4 animate-pulse" />
                            <span>Looking up order #12345...</span>
                            <Truck className="w-4 h-4" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
