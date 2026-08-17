import { Link } from "react-router-dom";
import brandIcon from "@/assets/brand-icon.png";

const services = {
  "Who We Serve": [
    { label: "Distributors", href: "/for/distributors" },
    { label: "Decorators", href: "/for/decorators" },
    { label: "Referral Partners", href: "/for/referral-partners" },
  ],
  "For Distributors": [
    { label: "AI Store Builder", href: "/features/store-builder" },
    { label: "AI Support", href: "/features/ai-support" },
    { label: "Auto-Routing", href: "/features/order-routing" },
    { label: "Reporting & Analytics", href: "/features/reporting" },
  ],
  "For Decorators": [
    { label: "AI Vision", href: "/features/ai-vision" },
    { label: "AI Support", href: "/features/ai-support" },
    { label: "Order Management", href: "/features/order-routing" },
  ],
  "Platform": [
    { label: "Multi-Store Management", href: "/features/multi-store" },
    { label: "AI Suggestions", href: "/features/ai-suggestions" },
    { label: "KPI Reports", href: "/features/kpi-reports" },
    { label: "Site Migration", href: "/features/site-migration" },
    { label: "Blog", href: "/blog" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img src={brandIcon} alt="" className="h-8 w-auto" />
              <span className="text-2xl font-bold">
                <span className="text-white">Brand-</span>
                <span className="text-primary">Shop.AI</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 mb-6 max-w-sm">
              The all-in-one platform for distributors and decorators to manage client stores, 
              automate support, and grow with AI-powered insights.
            </p>
          </div>

          {Object.entries(services).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-bold text-secondary-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.href}
                      className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-foreground/50">
              © 2026 Brand-Shop.AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">Terms of Use</a>
              <a href="#" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
