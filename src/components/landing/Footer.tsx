import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const services = {
  "For Decorators": ["Order Management", "AI Vision", "Auto-Routing", "Client Portal"],
  "For Distributors": ["AI Store Builder", "AI Support", "Dashboard & Analytics", "Pricing Controls"],
  "Platform": ["Multi-Store Management", "AI Suggestions", "KPI Reports", "Site Migration"],
};

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">BRAND-SHOP.AI</span>
            </Link>
            <p className="text-secondary-foreground/70 mb-6 max-w-sm">
              The all-in-one platform for distributors and decorators to manage client stores, 
              automate support, and grow with AI-powered insights.
            </p>
          </div>

          {/* Service Columns */}
          {Object.entries(services).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-bold text-secondary-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a 
                      href="#"
                      className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                    >
                      {item}
                    </a>
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
              © 2024 Brand-Shop.AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="#" 
                className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors"
              >
                Terms of Use
              </a>
              <a 
                href="#" 
                className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors"
              >
                Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
