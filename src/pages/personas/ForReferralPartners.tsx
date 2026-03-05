import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import {
  Users, Store, Tag, DollarSign, ArrowRight, Megaphone, Palette, TrendingUp
} from "lucide-react";

const whoThisIsFor = [
  { icon: Megaphone, label: "Agencies" },
  { icon: Users, label: "Micro & Macro Influencers" },
  { icon: TrendingUp, label: "Industry Leaders with an Audience" },
];

const valueProps = [
  {
    icon: Store,
    title: "Company Stores for Any Vertical",
    description: "Offer branded online stores to your audience — corporate, schools, sports, nonprofits, and more.",
  },
  {
    icon: Palette,
    title: "Decorated Apparel at Case Pricing",
    description: "One-off items and decorated apparel at wholesale case pricing. No minimums headaches.",
  },
  {
    icon: Tag,
    title: "White-Label Under Your Brand",
    description: "Every store is branded to you — your logo, your domain, your client relationship.",
  },
  {
    icon: DollarSign,
    title: "Revenue Share & Commissions",
    description: "Earn on every order. The more stores you bring, the more you make.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const ForReferralPartners = () => {
  return (
    <div className="min-h-screen">
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
              Offer Branded Stores to Your Audience.{" "}
              <span className="text-primary">Earn While You Grow.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-8"
            >
              You've built an audience. Now monetize it with white-labeled company stores — 
              no inventory, no fulfillment, just commissions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button asChild size="lg" className="text-base">
                <Link to="/assessment">Take the Assessment <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12"
            >
              Who This Is For
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
              {whoThisIsFor.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center gap-3 bg-muted rounded-full px-6 py-3"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              Why <span className="text-primary">Partner</span> With Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
            >
              Everything you need to offer branded stores — nothing to manage.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {valueProps.map((prop, i) => (
                <motion.div
                  key={prop.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border border-border rounded-xl p-6 bg-card"
                >
                  <prop.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{prop.title}</h3>
                  <p className="text-muted-foreground text-sm">{prop.description}</p>
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
              Ready to Start Earning?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-secondary-foreground/70 mb-8 max-w-lg mx-auto"
            >
              Take a quick assessment and see how the referral partner program works for you.
            </motion.p>
            <Button asChild size="lg" className="text-base">
              <Link to="/assessment">Take the Assessment <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForReferralPartners;
