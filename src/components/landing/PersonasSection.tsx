import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Store, Printer, Users, ArrowRight } from "lucide-react";

const personas = [
  {
    icon: Store,
    title: "Distributors",
    summary: "Centralize all your client stores. AI manages them, routes orders, and provides 24/7 omnichannel support.",
    href: "/for/distributors",
  },
  {
    icon: Printer,
    title: "Decorators",
    summary: "Stop copy-pasting PO data and fielding status calls. Let AI read POs, enter data, and answer clients for you.",
    href: "/for/decorators",
  },
  {
    icon: Users,
    title: "Referral Partners",
    summary: "Offer branded company stores to your audience. Earn commissions with zero inventory or fulfillment.",
    href: "/for/referral-partners",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

export const PersonasSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Who We <span className="text-primary">Serve</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
        >
          Built for the people who power the promotional products industry.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {personas.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link
                to={p.href}
                className="block border border-border rounded-xl p-6 bg-card hover:shadow-lg transition-shadow h-full group"
              >
                <p.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{p.summary}</p>
                <span className="inline-flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
