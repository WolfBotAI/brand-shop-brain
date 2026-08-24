import { motion } from "framer-motion";
import { SEO } from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import {
  FileText, Copy, CheckSquare, Phone, Bot, Eye, Plug, ArrowRight, AlertTriangle
} from "lucide-react";

const painPoints = [
  {
    icon: FileText,
    title: "Every PO Looks Different",
    description: "Every distributor and company sends POs in a different format — PDFs, emails, photos, phone calls. There's no consistency.",
  },
  {
    icon: AlertTriangle,
    title: "Half of Them Are Incomplete",
    description: "Missing sizes, no ink colors, no due date, art referenced but not attached. Every gap means another email and another delay.",
  },
  {
    icon: Copy,
    title: "Manual Data Entry All Day",
    description: "Your staff opens emails and copies PO data line by line into your own system. It's slow, tedious, and error-prone.",
  },
  {
    icon: CheckSquare,
    title: "Double-Checking Everything",
    description: "Supervisors re-check every entry for accuracy. One wrong size or color means reprints and lost profit.",
  },
  {
    icon: Phone,
    title: "Overwhelmed by Status Calls",
    description: "Clients and distributors call and email nonstop asking for order updates. You can't answer them all — so calls go unanswered and emails sit for days.",
  },
];

const solutions = [
  {
    icon: Eye,
    title: "AI Vision Agent",
    description: "Reads any PO format — PDF, photo, email, even handwritten — extracts every field automatically, and flags what's missing before it hits your floor.",
  },
  {
    icon: Phone,
    title: "AI Voice Receptionist",
    description: "Answers calls and texts around the clock with order tracking and product info, resolves support issues like returns, takes messages, and transfers calls when a human is needed.",
  },
  {
    icon: Bot,
    title: "AI Support Agent",
    description: "Handles client inquiries 24/7 across web chat, SMS, email, Facebook Messenger, and Instagram Messenger — so nothing sits unanswered.",
  },
  {
    icon: Plug,
    title: "Plugs Into Your System",
    description: "Our AI integrates into your existing platform — even if you run your shop off spreadsheets. No need to switch systems.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const ForDecorators = () => {
  return (
    <div className="min-h-screen">
      <SEO title="For Decorators: AI That Reads Every PO and Answers the Phone | Brand-Shop.AI" description="Mismatched, incomplete POs and nonstop status calls. AI Vision reads any PO format and our AI receptionist answers calls, texts, and Messenger 24/7." path="/for/decorators" />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Stop Copy-Pasting POs.{" "}
              <span className="text-primary">Let AI Handle It.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-8"
            >
              Your team shouldn't spend hours re-entering PO data and answering tracking calls. 
              AI can do both — faster and around the clock.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button asChild size="lg" className="text-base">
                <Link to="/assessment">Calculate Your Time Savings <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              Sound Familiar?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
            >
              These are the bottlenecks decorators deal with every single day.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {painPoints.map((point, i) => (
                <motion.div
                  key={point.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border border-border rounded-xl p-6 bg-card"
                >
                  <point.icon className="w-8 h-8 text-destructive mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                  <p className="text-muted-foreground text-sm">{point.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              How We <span className="text-primary">Solve It</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
            >
              AI that reads, responds, and integrates — so your team produces.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {solutions.map((sol, i) => (
                <motion.div
                  key={sol.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border border-border rounded-xl p-6 bg-card"
                >
                  <sol.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{sol.title}</h3>
                  <p className="text-muted-foreground text-sm">{sol.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Automate Your PO Workflow?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-secondary-foreground/70 mb-8 max-w-lg mx-auto"
            >
              Take a quick assessment and see how AI can transform your decoration business.
            </motion.p>
            <Button asChild size="lg" className="text-base">
              <Link to="/assessment">Calculate Your Time Savings <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForDecorators;
