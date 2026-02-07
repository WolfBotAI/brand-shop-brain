import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Church, Building2, Users, ChevronDown } from "lucide-react";

const organizationTypes = [
  { id: "schools", label: "High Schools", icon: GraduationCap },
  { id: "churches", label: "Churches", icon: Church },
  { id: "b2b", label: "B2B Brands", icon: Building2 },
  { id: "b2c", label: "B2C Brands", icon: Users },
];

export const Hero = () => {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image Placeholder - lifestyle imagery */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-muted"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-20 text-center">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            What is your{" "}
            <span className="text-primary">organization type?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your organization to discover how Brand-Shop.AI can transform your branded merchandise experience.
          </p>
        </motion.div>

        {/* Organization Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          {organizationTypes.slice(0, showMore ? organizationTypes.length : 2).map((org, index) => {
            const Icon = org.icon;
            return (
              <motion.button
                key={org.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                onClick={() => setSelectedOrg(org.id)}
                className={`
                  flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all duration-300
                  ${selectedOrg === org.id 
                    ? 'bg-primary border-primary text-primary-foreground shadow-lg' 
                    : 'bg-card border-border text-foreground hover:border-primary hover:shadow-md'
                  }
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="text-lg font-semibold">{org.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Show More Button */}
        {!showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <button
              onClick={() => setShowMore(true)}
              className="flex items-center gap-2 mx-auto text-muted-foreground hover:text-primary transition-colors"
            >
              <span>More organization types</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg rounded-full"
            disabled={!selectedOrg}
          >
            Start Now
          </Button>
          {!selectedOrg && (
            <p className="text-sm text-muted-foreground mt-3">
              Select an organization type to continue
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
