import { useState } from "react";
import { SEO } from "@/components/seo/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, Users, Printer, Megaphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

type Persona = "distributor" | "decorator" | "referral";
type DISCPace = "outgoing" | "reserved" | null;
type DISCPriority = "task" | "people" | null;

interface AssessmentState {
  step: number;
  persona: Persona | null;
  painPoints: string[];
  discPace: DISCPace;
  discPriority: DISCPriority;
  contact: { name: string; email: string; phone: string; smsConsent: boolean };
}

const personaOptions = [
  {
    id: "distributor" as Persona,
    icon: Users,
    title: "Distributor",
    description: "I supply branded apparel to schools, churches, businesses",
  },
  {
    id: "decorator" as Persona,
    icon: Printer,
    title: "Decorator",
    description: "I print, embroider, or decorate apparel for clients",
  },
  {
    id: "referral" as Persona,
    icon: Megaphone,
    title: "Referral Partner",
    description: "I'm an agency, influencer, or industry leader with an audience",
  },
];

const painPointQuestions: Record<Persona, { question: string; options: string[] }[]> = {
  distributor: [
    {
      question: "How many client stores do you currently manage?",
      options: ["1–5", "6–20", "20+", "None yet"],
    },
    {
      question: "What's your biggest operational headache?",
      options: [
        "Updating websites across multiple platforms",
        "Forwarding POs to suppliers & decorators",
        "Answering customer tracking calls & emails",
        "All of the above",
      ],
    },
    {
      question: "How do you currently handle customer support?",
      options: [
        "I answer everything myself",
        "I have staff but they're overwhelmed",
        "I don't — customers wait",
        "I outsource it",
      ],
    },
  ],
  decorator: [
    {
      question: "How do you currently receive purchase orders?",
      options: ["Email PDFs", "Phone calls", "Web forms", "Mix of everything"],
    },
    {
      question: "What's your biggest PO processing challenge?",
      options: [
        "Inconsistent formats from clients",
        "Manual copy-paste into our system",
        "Supervisor has to verify every entry",
        "All of the above",
      ],
    },
    {
      question: "How do you handle client calls and status requests?",
      options: [
        "We answer when we can",
        "We're overwhelmed and miss calls",
        "We have staff dedicated to this",
        "We don't have a system",
      ],
    },
  ],
  referral: [
    {
      question: "What kind of audience do you serve?",
      options: ["Local businesses", "Schools & organizations", "Social media following", "Industry network"],
    },
    {
      question: "Have you offered branded merchandise before?",
      options: ["Yes, actively", "Tried but too complex", "No but interested", "No and not sure"],
    },
    {
      question: "What would make you want to refer a merch platform?",
      options: [
        "Revenue share & commissions",
        "Value to my audience",
        "White-label under my brand",
        "Case pricing for one-offs",
      ],
    },
  ],
};

const discPaceQuestions: Record<Persona, { question: string; optionA: string; optionB: string }> = {
  distributor: {
    question: "When a new client reaches out about a company store, you typically…",
    optionA: "Jump in immediately — send them options same day",
    optionB: "Take time to research their needs before responding",
  },
  decorator: {
    question: "When you receive a rush order from a top client, you…",
    optionA: "Rally the team and get it done fast, communicating every step",
    optionB: "Quietly prioritize it and deliver without fanfare",
  },
  referral: {
    question: "When you discover a product your audience would love, you…",
    optionA: "Share it immediately with excitement and energy",
    optionB: "Test it yourself first and share a thoughtful review",
  },
};

const discPriorityQuestions: Record<Persona, { question: string; optionA: string; optionB: string }> = {
  distributor: {
    question: "What matters more when choosing a decorator partner?",
    optionA: "On-time delivery and competitive pricing",
    optionB: "Strong communication and relationship",
  },
  decorator: {
    question: "What makes you proudest about your shop?",
    optionA: "Efficiency — fast turnaround and zero defects",
    optionB: "Relationships — clients trust us and keep coming back",
  },
  referral: {
    question: "What drives your recommendations?",
    optionA: "ROI and measurable results for your audience",
    optionB: "How the brand treats people and builds community",
  },
};

function getDISCType(pace: DISCPace, priority: DISCPriority) {
  if (pace === "outgoing" && priority === "task") return { type: "D", label: "Dominant", description: "You're direct, results-oriented, and decisive. You want solutions that save time and scale fast." };
  if (pace === "outgoing" && priority === "people") return { type: "I", label: "Influential", description: "You're enthusiastic, collaborative, and people-focused. You thrive on relationships and building community." };
  if (pace === "reserved" && priority === "people") return { type: "S", label: "Steady", description: "You're patient, dependable, and supportive. You value consistency and a smooth, reliable process." };
  return { type: "C", label: "Conscientious", description: "You're analytical, detail-oriented, and quality-focused. You want data-driven, precise solutions." };
}

const personaValueProps: Record<Persona, { headline: string; points: string[] }> = {
  distributor: {
    headline: "You're ready to scale without the chaos.",
    points: [
      "White-labeled agency account — your brand, your clients",
      "AI-powered stores built automatically for each client",
      "AI Support Agent handles web chat, SMS, email, Facebook & Instagram",
      "AI Voice answers phone calls with real-time order tracking",
      "Our certified decorator network ensures quality and tracking",
      "You focus on selling — we handle everything else",
    ],
  },
  decorator: {
    headline: "Stop drowning in POs and phone calls.",
    points: [
      "AI Vision reads any PO format — PDF, photo, handwritten — automatically",
      "No more copy-paste errors or supervisor double-checking",
      "AI Support Agent handles client status requests 24/7",
      "AI Voice answers your phone and provides tracking updates",
      "Integrates directly into your existing systems",
      "Your team focuses on production, not paperwork",
    ],
  },
  referral: {
    headline: "Turn your audience into a revenue stream.",
    points: [
      "Offer company stores for almost any vertical",
      "Decorated apparel & one-off items at case pricing",
      "White-label under your brand or co-brand",
      "Revenue share on every order",
      "AI handles everything — stores, support, fulfillment",
      "Your audience gets a premium experience, you earn while they shop",
    ],
  },
};

// Total steps: 1 (persona) + 3 (pain points) + 1 (DISC pace) + 1 (DISC priority) + 1 (contact) + 1 (results) = 8
const TOTAL_STEPS = 8;

const Assessment = () => {
  const [state, setState] = useState<AssessmentState>({
    step: 1,
    persona: null,
    painPoints: [],
    discPace: null,
    discPriority: null,
    contact: { name: "", email: "", phone: "", smsConsent: false },
  });

  const progress = (state.step / TOTAL_STEPS) * 100;

  const selectPersona = (p: Persona) => {
    setState((s) => ({ ...s, persona: p, step: 2 }));
  };

  const selectPainPoint = (answer: string) => {
    setState((s) => {
      const newPainPoints = [...s.painPoints, answer];
      const painIndex = s.step - 2; // 0, 1, 2
      if (painIndex < 2) {
        return { ...s, painPoints: newPainPoints, step: s.step + 1 };
      }
      return { ...s, painPoints: newPainPoints, step: 5 }; // go to DISC pace
    });
  };

  const selectDISCPace = (pace: DISCPace) => {
    setState((s) => ({ ...s, discPace: pace, step: 6 }));
  };

  const selectDISCPriority = (priority: DISCPriority) => {
    setState((s) => ({ ...s, discPriority: priority, step: 7 }));
  };

  const submitContact = () => {
    setState((s) => ({ ...s, step: 8 }));
  };

  const goBack = () => {
    setState((s) => {
      if (s.step === 1) return s;
      if (s.step === 5) return { ...s, step: 4, painPoints: s.painPoints.slice(0, -1) };
      if (s.step > 2 && s.step <= 4) return { ...s, step: s.step - 1, painPoints: s.painPoints.slice(0, -1) };
      return { ...s, step: s.step - 1 };
    });
  };

  const disc = state.discPace && state.discPriority ? getDISCType(state.discPace, state.discPriority) : null;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Savings Calculator | Brand-Shop.AI" description="Estimate how much time and money you can save by switching to Brand-Shop.AI for your distributor or decorator business." path="/assessment" />
      <Navbar />
      <main className="pt-20">
        {/* Progress bar */}
        <div className="fixed top-20 left-0 right-0 z-30 h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[70vh] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* Step 1: Persona */}
            {state.step === 1 && (
              <motion.div key="persona" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Free Savings Calculator</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Which best describes you?</h1>
                  <p className="text-muted-foreground">We'll customize your experience based on your role.</p>
                </div>
                <div className="grid gap-4">
                  {personaOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => selectPersona(opt.id)}
                        className="flex items-center gap-5 p-6 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{opt.title}</h3>
                          <p className="text-muted-foreground text-sm">{opt.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Steps 2-4: Pain Points */}
            {state.step >= 2 && state.step <= 4 && state.persona && (
              <motion.div key={`pain-${state.step}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <button onClick={goBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-center mb-10">
                  <p className="text-sm text-primary font-medium mb-2">Question {state.step - 1} of 3</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {painPointQuestions[state.persona][state.step - 2].question}
                  </h2>
                </div>
                <div className="grid gap-3">
                  {painPointQuestions[state.persona][state.step - 2].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => selectPainPoint(opt)}
                      className="p-5 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left text-foreground font-medium"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: DISC Pace */}
            {state.step === 5 && state.persona && (
              <motion.div key="disc-pace" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <button onClick={goBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-center mb-10">
                  <p className="text-sm text-primary font-medium mb-2">Almost there</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {discPaceQuestions[state.persona].question}
                  </h2>
                </div>
                <div className="grid gap-4">
                  <button
                    onClick={() => selectDISCPace("outgoing")}
                    className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left"
                  >
                    <p className="text-foreground font-medium">{discPaceQuestions[state.persona].optionA}</p>
                  </button>
                  <button
                    onClick={() => selectDISCPace("reserved")}
                    className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left"
                  >
                    <p className="text-foreground font-medium">{discPaceQuestions[state.persona].optionB}</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 6: DISC Priority */}
            {state.step === 6 && state.persona && (
              <motion.div key="disc-priority" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <button onClick={goBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-center mb-10">
                  <p className="text-sm text-primary font-medium mb-2">One more</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {discPriorityQuestions[state.persona].question}
                  </h2>
                </div>
                <div className="grid gap-4">
                  <button
                    onClick={() => selectDISCPriority("task")}
                    className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left"
                  >
                    <p className="text-foreground font-medium">{discPriorityQuestions[state.persona].optionA}</p>
                  </button>
                  <button
                    onClick={() => selectDISCPriority("people")}
                    className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left"
                  >
                    <p className="text-foreground font-medium">{discPriorityQuestions[state.persona].optionB}</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 7: Contact */}
            {state.step === 7 && (
              <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <button onClick={goBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">See Your Results</h2>
                  <p className="text-muted-foreground">Enter your info to get your personalized recommendations.</p>
                </div>
                <div className="space-y-4 max-w-md mx-auto">
                  <Input
                    placeholder="Full Name"
                    value={state.contact.name}
                    onChange={(e) => setState((s) => ({ ...s, contact: { ...s.contact, name: e.target.value } }))}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={state.contact.email}
                    onChange={(e) => setState((s) => ({ ...s, contact: { ...s.contact, email: e.target.value } }))}
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={state.contact.phone}
                    onChange={(e) => setState((s) => ({ ...s, contact: { ...s.contact, phone: e.target.value } }))}
                  />
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.contact.smsConsent}
                      onChange={(e) => setState((s) => ({ ...s, contact: { ...s.contact, smsConsent: e.target.checked } }))}
                      className="mt-1 accent-[hsl(var(--primary))]"
                    />
                    <span className="text-sm text-muted-foreground">
                      I agree to receive SMS communications. Message & data rates may apply. Reply STOP to opt out.
                    </span>
                  </label>
                  <Button
                    onClick={submitContact}
                    disabled={!state.contact.name || !state.contact.email}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-full group"
                  >
                    See My Results
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 8: Results */}
            {state.step === 8 && state.persona && disc && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <span className="text-3xl font-bold text-primary">{disc.type}</span>
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Your Profile: <span className="text-primary">{disc.label}</span>
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">{disc.description}</p>
                </div>

                {/* Value Proposition */}
                <div className="bg-card border border-border rounded-2xl p-8 mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {personaValueProps[state.persona].headline}
                  </h3>
                  <ul className="space-y-3">
                    {personaValueProps[state.persona].points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 text-xl rounded-full group"
                  >
                    Book Your Demo
                    <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Assessment;
