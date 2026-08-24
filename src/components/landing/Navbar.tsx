import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import brandLogo from "@/assets/brand-logo.png";

const featureLinks = [
  { label: "AI Store Builder", href: "/features/store-builder" },
  { label: "AI Vision", href: "/features/ai-vision" },
  { label: "AI Support", href: "/features/ai-support" },
  { label: "AI Suggestions", href: "/features/ai-suggestions" },
  { label: "Order Routing", href: "/features/order-routing" },
  { label: "Multi-Store", href: "/features/multi-store" },
  { label: "KPI Reports", href: "/features/kpi-reports" },
  { label: "Reporting", href: "/features/reporting" },
  { label: "Site Migration", href: "/features/site-migration" },
  { label: "Pop-Up Stores", href: "/features/popup-stores" },
];

const personaLinks = [
  { label: "Distributors", href: "/for/distributors" },
  { label: "Decorators", href: "/for/decorators" },
  { label: "Referral Partners", href: "/for/referral-partners" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isPersonasOpen, setIsPersonasOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const personasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFeaturesOpen(false);
      }
      if (personasRef.current && !personasRef.current.contains(e.target as Node)) {
        setIsPersonasOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/90 backdrop-blur-sm ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <img src={brandLogo} alt="Brand-Shop.AI" className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <Link to="/assessment" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Savings Calculator
              </Link>

              {/* Who We Serve Dropdown */}
              <div className="relative" ref={personasRef}>
                <button
                  onClick={() => setIsPersonasOpen(!isPersonasOpen)}
                  className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  Who We Serve
                  <ChevronDown className={`w-4 h-4 transition-transform ${isPersonasOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isPersonasOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-2 z-50"
                    >
                      {personaLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsPersonasOpen(false)}
                          className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Features Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                  className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  Features
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFeaturesOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isFeaturesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-2 z-50"
                    >
                      {featureLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsFeaturesOpen(false)}
                          className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/blog" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Blog
              </Link>

              {/* Auth Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://hub.brand-shop.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  Log In
                </a>
                <a
                  href="https://hub.brand-shop.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground p-2"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-24 md:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 pb-8">
              <div className="flex flex-col gap-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-4 text-xl text-foreground border-b border-border">
                  Home
                </Link>
                <p className="pt-4 pb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">Who We Serve</p>
                {personaLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 pl-4 text-lg text-foreground border-b border-border"
                  >
                    {link.label}
                  </Link>
                ))}
                <p className="pt-4 pb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">Features</p>
                {featureLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 pl-4 text-lg text-foreground border-b border-border"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="py-4 text-xl text-foreground border-b border-border">
                  Blog
                </Link>
                <div className="flex flex-col gap-3 pt-6">
                  <a
                    href="https://hub.brand-shop.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-3 text-lg text-foreground border border-border rounded-lg"
                  >
                    Log In
                  </a>
                  <a
                    href="https://hub.brand-shop.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-3 text-lg bg-primary text-primary-foreground rounded-lg font-medium"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
