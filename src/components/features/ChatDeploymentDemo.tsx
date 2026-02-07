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
  Truck,
  Volume2,
  Languages
} from "lucide-react";
import { ChatBubble } from "./ChatBubble";

// All supported channels including social
const channels = [
  { id: "chat", icon: MessageSquare, label: "Web Chat", color: "bg-blue-500" },
  { id: "phone", icon: Phone, label: "AI Voice", color: "bg-green-500" },
  { id: "sms", icon: MessageCircle, label: "SMS", color: "bg-orange-500" },
  { id: "email", icon: Mail, label: "Email", color: "bg-purple-500" },
  { id: "facebook", icon: MessageSquare, label: "Facebook", color: "bg-blue-600" },
  { id: "instagram", icon: MessageCircle, label: "Instagram", color: "bg-pink-500" },
];

const websiteTypes = [
  { id: "school", label: "Lincoln High School", url: "lincolnhs.edu/store" },
  { id: "church", label: "Grace Community Church", url: "gracecc.org/shop" },
  { id: "business", label: "TechCorp Inc", url: "techcorp.com/merch" },
];

const voiceLanguages = [
  { code: "en", name: "English", greeting: "Hello, thank you for calling Lincoln High School Store!" },
  { code: "es", name: "Español", greeting: "¡Hola, gracias por llamar a la tienda de Lincoln High School!" },
  { code: "fr", name: "Français", greeting: "Bonjour, merci d'avoir appelé la boutique de Lincoln High School!" },
  { code: "zh", name: "中文", greeting: "您好，感谢致电林肯高中商店！" },
  { code: "de", name: "Deutsch", greeting: "Hallo, danke für Ihren Anruf bei Lincoln High School Store!" },
];

const chatMessages = [
  { sender: "customer", text: "Hi, where's my order #12345?", channel: "instagram" },
  { sender: "ai", text: "Hi Sarah! I see you're the same customer who messaged on Instagram earlier. Let me check that order..." },
  { sender: "ai", text: "Your order #12345 shipped yesterday via UPS. It's arriving Friday, March 15th." },
  { sender: "customer", text: "Can I change the delivery address?" },
  { sender: "ai", text: "I've already started the address change request since you mentioned this in your Instagram message! What's the new address?" },
];

type DemoPhase = "embed" | "voice" | "unified" | "conversation";

export const ChatDeploymentDemo = () => {
  const [phase, setPhase] = useState<DemoPhase>("embed");
  const [activeWebsite, setActiveWebsite] = useState(0);
  const [activeChannel, setActiveChannel] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-play demo
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Phase 1: Embed demo
    timers.push(setTimeout(() => setActiveWebsite(1), 1500));
    timers.push(setTimeout(() => setActiveWebsite(2), 3000));
    timers.push(setTimeout(() => setActiveWebsite(0), 4500));
    
    // Phase 2: Voice demo
    timers.push(setTimeout(() => setPhase("voice"), 6000));
    timers.push(setTimeout(() => {
      setIsSpeaking(true);
      setActiveLanguage(0);
    }, 7000));
    timers.push(setTimeout(() => setActiveLanguage(1), 9000));
    timers.push(setTimeout(() => setActiveLanguage(2), 11000));
    timers.push(setTimeout(() => setIsSpeaking(false), 13000));
    
    // Phase 3: Unified brain
    timers.push(setTimeout(() => setPhase("unified"), 14000));
    timers.push(setTimeout(() => setActiveChannel(1), 15000));
    timers.push(setTimeout(() => setActiveChannel(2), 16000));
    timers.push(setTimeout(() => setActiveChannel(3), 17000));
    timers.push(setTimeout(() => setActiveChannel(4), 18000));
    timers.push(setTimeout(() => setActiveChannel(5), 19000));
    timers.push(setTimeout(() => setActiveChannel(0), 20000));
    
    // Phase 4: Conversation with shared memory
    timers.push(setTimeout(() => setPhase("conversation"), 21500));
    
    // Show messages one by one
    timers.push(setTimeout(() => setVisibleMessages(1), 22500));
    timers.push(setTimeout(() => setIsLookingUp(true), 23500));
    timers.push(setTimeout(() => {
      setIsLookingUp(false);
      setVisibleMessages(2);
    }, 24500));
    timers.push(setTimeout(() => setVisibleMessages(3), 25500));
    timers.push(setTimeout(() => setVisibleMessages(4), 27000));
    timers.push(setTimeout(() => setVisibleMessages(5), 28500));
    
    // Reset
    timers.push(setTimeout(() => {
      setPhase("embed");
      setActiveWebsite(0);
      setActiveChannel(0);
      setVisibleMessages(0);
      setIsLookingUp(false);
      setActiveLanguage(0);
      setIsSpeaking(false);
    }, 32000));

    return () => timers.forEach(clearTimeout);
  }, [phase === "embed"]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI Support Across Every Channel
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            20+ languages • Voice & Chat • Facebook, Instagram, SMS, Email • Shared memory across all channels
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Phase tabs */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {[
              { id: "embed", label: "Embed Anywhere" },
              { id: "voice", label: "AI Voice (20+ Languages)" },
              { id: "unified", label: "All Channels" },
              { id: "conversation", label: "Shared Memory" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPhase(tab.id as DemoPhase)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
                  <ChatBubble message="Add AI support to any website with a single line of code. Works on Shopify, WordPress, or custom sites." />
                  
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
                      <span className="text-sm font-medium text-secondary-foreground">One Line Integration</span>
                    </div>
                    <code className="text-sm text-primary font-mono">
                      {'<script src="https://brandshop.ai/widget.js" data-store="YOUR_ID"></script>'}
                    </code>
                  </motion.div>
                </motion.div>
              )}

              {/* Voice Phase - 20+ Languages */}
              {phase === "voice" && (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="AI Voice handles phone calls in 20+ languages with natural speech. Callers get instant help without waiting." />
                  
                  <div className="max-w-lg mx-auto">
                    {/* Phone Interface */}
                    <div className="bg-muted rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">Incoming Call</p>
                            <p className="text-sm text-muted-foreground">Lincoln High Store</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Languages className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-primary">20+ Languages</span>
                        </div>
                      </div>
                      
                      {/* Language Selector */}
                      <div className="flex gap-2 mb-6 flex-wrap">
                        {voiceLanguages.map((lang, index) => (
                          <button
                            key={lang.code}
                            onClick={() => setActiveLanguage(index)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              activeLanguage === index
                                ? "bg-primary text-primary-foreground"
                                : "bg-background text-muted-foreground hover:bg-background/80"
                            }`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                      
                      {/* AI Speaking */}
                      <div className="bg-background rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <motion.div
                            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
                            animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                          >
                            <Volume2 className="w-5 h-5 text-primary-foreground" />
                          </motion.div>
                          <div>
                            <p className="text-sm font-medium text-card-foreground">AI Voice Agent</p>
                            <p className="text-xs text-muted-foreground">Speaking {voiceLanguages[activeLanguage].name}</p>
                          </div>
                        </div>
                        
                        {/* Sound Wave Animation */}
                        {isSpeaking && (
                          <div className="flex items-center justify-center gap-1 h-12 mb-3">
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-primary rounded-full"
                                animate={{
                                  height: [8, 24 + Math.random() * 16, 8],
                                }}
                                transition={{
                                  duration: 0.4 + Math.random() * 0.2,
                                  repeat: Infinity,
                                  delay: i * 0.05,
                                }}
                              />
                            ))}
                          </div>
                        )}
                        
                        <motion.p 
                          className="text-sm text-card-foreground italic text-center"
                          key={activeLanguage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          "{voiceLanguages[activeLanguage].greeting}"
                        </motion.p>
                      </div>
                      
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        AI knows caller ID → Account lookup → Full order history available instantly
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Unified Brain Phase - All Channels */}
              {phase === "unified" && (
                <motion.div
                  key="unified"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="One AI brain powers Chat, Voice, SMS, Email, Facebook & Instagram. Same knowledge everywhere." />
                  
                  <div className="flex flex-col items-center py-8">
                    {/* All 6 Channels */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
                      {channels.map((channel, index) => (
                        <motion.div
                          key={channel.id}
                          className="flex flex-col items-center gap-2"
                          animate={{
                            scale: activeChannel === index ? 1.2 : 1,
                            y: activeChannel === index ? -10 : 0
                          }}
                        >
                          <div className={`w-12 h-12 rounded-full ${channel.color} flex items-center justify-center`}>
                            <channel.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-xs font-medium text-card-foreground">{channel.label}</span>
                          
                          {/* Connection line */}
                          <motion.div
                            className="w-0.5 h-8 bg-muted"
                            animate={{
                              backgroundColor: activeChannel === index ? "hsl(var(--primary))" : "hsl(var(--muted))"
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Central brain */}
                    <motion.div
                      className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-xl"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Brain className="w-10 h-10 text-primary-foreground" />
                    </motion.div>
                    
                    <p className="mt-6 text-center text-muted-foreground max-w-md">
                      Customer starts on Instagram, continues on phone — the AI remembers everything. 
                      No repetition, no frustration.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Conversation Phase - Shared Memory Demo */}
              {phase === "conversation" && (
                <motion.div
                  key="conversation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ChatBubble message="Watch the AI remember a conversation that started on Instagram and continues on web chat." />
                  
                  <div className="max-w-md mx-auto bg-muted rounded-xl overflow-hidden">
                    {/* Chat header with channel indicator */}
                    <div className="bg-primary px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary-foreground">Brand-Shop.AI Support</p>
                          <p className="text-xs text-primary-foreground/70">Web Chat • Shared Memory Active</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="w-4 h-4 text-primary-foreground/70" />
                        <span className="text-xs text-primary-foreground/70">Remembers IG</span>
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
