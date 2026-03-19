import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Building2, ShoppingBag, DollarSign, Users, PartyPopper } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StepIndicator } from "@/components/features/AnimatedStep";
import { WelcomeStep } from "@/components/app/onboarding/WelcomeStep";
import { DistributorProfileStep } from "@/components/app/onboarding/DistributorProfileStep";
import { CatalogSetupStep, type CatalogSelection, type SelectedProduct } from "@/components/app/onboarding/CatalogSetupStep";
import { PricingStep, type PricingRules } from "@/components/app/onboarding/PricingStep";
import { AddClientStep } from "@/components/app/onboarding/AddClientStep";
import { CompletionStep } from "@/components/app/onboarding/CompletionStep";
import type { ThemeConfig } from "@/components/app/store/StorefrontPreview";

const steps = [
  { title: "Welcome", icon: Rocket },
  { title: "Profile", icon: Building2 },
  { title: "Catalog", icon: ShoppingBag },
  { title: "Pricing", icon: DollarSign },
  { title: "First Client", icon: Users },
  { title: "Complete", icon: PartyPopper },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Distributor profile data
  const [businessName, setBusinessName] = useState("");
  const [distributorLogoUrl, setDistributorLogoUrl] = useState<string | null>(null);

  // Catalog data
  const [catalogId, setCatalogId] = useState("");
  const [catalogProducts, setCatalogProducts] = useState<SelectedProduct[]>([]);

  // Pricing
  const [pricingRules, setPricingRules] = useState<PricingRules | null>(null);

  // Client store data
  const [storeId, setStoreId] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeTheme, setStoreTheme] = useState<ThemeConfig | undefined>();
  const [storeLogoUrl, setStoreLogoUrl] = useState<string | null>(null);

  const handleStepClick = (step: number) => {
    if (step < currentStep) setCurrentStep(step);
  };

  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Get Started</h1>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
              {Math.round(progress)}% complete
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          <div className="hidden md:block">
            <StepIndicator
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <WelcomeStep key="welcome" onNext={() => setCurrentStep(1)} />
              )}
              {currentStep === 1 && (
                <DistributorProfileStep
                  key="profile"
                  onNext={(data) => {
                    setBusinessName(data.businessName);
                    setDistributorLogoUrl(data.logoUrl);
                    setCurrentStep(2);
                  }}
                  onBack={() => setCurrentStep(0)}
                />
              )}
              {currentStep === 2 && (
                <CatalogSetupStep
                  key="catalog"
                  onNext={(data: CatalogSelection) => {
                    setCatalogId(data.catalogId);
                    setCatalogProducts(data.products);
                    setCurrentStep(3);
                  }}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              {currentStep === 3 && (
                <PricingStep
                  key="pricing"
                  products={catalogProducts}
                  catalogId={catalogId}
                  onNext={(rules) => {
                    setPricingRules(rules);
                    setCurrentStep(4);
                  }}
                  onBack={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 4 && (
                <AddClientStep
                  key="client"
                  catalogId={catalogId}
                  products={catalogProducts}
                  pricingRules={pricingRules!}
                  onNext={(data) => {
                    setStoreId(data.storeId);
                    setStoreName(data.storeName);
                    setStoreTheme(data.theme);
                    setStoreLogoUrl(data.logoUrl);
                    setCurrentStep(5);
                  }}
                  onSkip={() => setCurrentStep(5)}
                  onBack={() => setCurrentStep(3)}
                />
              )}
              {currentStep === 5 && (
                <CompletionStep
                  key="complete"
                  storeId={storeId}
                  storeName={storeName}
                  products={catalogProducts}
                  theme={storeTheme}
                  logoUrl={storeLogoUrl}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
