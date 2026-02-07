import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const featureLinks = [
  { label: "AI Store Builder", href: "/features/store-builder" },
  { label: "AI Chat & Voice", href: "/features/ai-support" },
  { label: "AI Vision", href: "/features/ai-vision" },
  { label: "Order Routing", href: "/features/order-routing" },
  { label: "Dashboard", href: "/features/dashboard" },
  { label: "Acquisition Engine", href: "/features/acquisition" },
];

const navLinks = [
  { label: "Integrations", href: "#integrations" },
  { label: "Resources", href: "#" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-secondary/95 backdrop-blur-sm shadow-md" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">B</span>
              </div>
              <span className="text-xl font-bold text-secondary-foreground">Brand-Shop.AI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {/* Features Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 text-secondary-foreground/80 hover:text-primary transition-colors font-medium">
                  Features
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-lg py-2"
                    >
                      {featureLinks.map((link) => (
                        <Link
                          key={link.label}
                          to={link.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-secondary-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-secondary-foreground hover:text-primary hover:bg-secondary-foreground/10"
              >
                Log In
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
              >
                Book Demo
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-secondary-foreground p-2"
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
            className="fixed inset-0 z-40 bg-secondary pt-24 md:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 pb-8">
              <div className="flex flex-col gap-2">
                {/* Features section */}
                <div className="py-4 border-b border-secondary-foreground/10">
                  <span className="text-xs uppercase tracking-wider text-secondary-foreground/50 mb-3 block">Features</span>
                  {featureLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 text-lg text-secondary-foreground/80 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-xl text-secondary-foreground border-b border-secondary-foreground/10"
                  >
                    {link.label}
                  </a>
                ))}
                
                <div className="flex flex-col gap-4 pt-8">
                  <Button 
                    variant="outline" 
                    className="w-full py-6 text-lg border-secondary-foreground/30 text-secondary-foreground"
                  >
                    Log In
                  </Button>
                  <Button 
                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Book Demo
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
