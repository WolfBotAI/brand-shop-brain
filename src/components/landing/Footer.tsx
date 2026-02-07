import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Features: [
    { label: "AI Store Builder", href: "/features/store-builder" },
    { label: "AI Chat & Voice", href: "/features/ai-support" },
    { label: "AI Vision", href: "/features/ai-vision" },
    { label: "Order Routing", href: "/features/order-routing" },
    { label: "Dashboard", href: "/features/dashboard" },
    { label: "Acquisition Engine", href: "/features/acquisition" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
  ],
  Resources: [
    { label: "Help Center", href: "#" },
    { label: "Integrations", href: "#integrations" },
    { label: "Case Studies", href: "#" },
    { label: "Partners", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* CTA Section */}
      <div className="border-b border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your{" "}
              <span className="text-primary">Distribution Business?</span>
            </h2>
            <p className="text-lg text-secondary-foreground/70 mb-8 max-w-2xl mx-auto">
              Join leading apparel distributors who've switched to the AI-powered platform. 
              Book a strategy call to see how Brand-Shop.AI can work for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group"
              >
                Book Strategy Call
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 px-8 py-6 text-lg rounded-full"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">B</span>
              </div>
              <span className="text-2xl font-bold">Brand-Shop.AI</span>
            </Link>
            <p className="text-secondary-foreground/60 mb-6 max-w-xs">
              The smartest e-commerce platform for apparel distributors. 
              Powered by WolfBot.AI unified intelligence.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@brand-shop.ai" className="flex items-center gap-3 text-secondary-foreground/60 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
                hello@brand-shop.ai
              </a>
              <a href="tel:+1-800-BRANDAI" className="flex items-center gap-3 text-secondary-foreground/60 hover:text-primary transition-colors">
                <Phone className="w-5 h-5" />
                1-800-BRAND-AI
              </a>
              <div className="flex items-center gap-3 text-secondary-foreground/60">
                <MapPin className="w-5 h-5" />
                San Francisco, CA
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-secondary-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link 
                        to={link.href}
                        className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a 
                        href={link.href}
                        className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-foreground/50">
              © 2024 Brand-Shop.AI. All rights reserved. Powered by WolfBot.AI
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
