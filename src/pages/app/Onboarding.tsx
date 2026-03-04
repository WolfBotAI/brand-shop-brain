import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Link2, PackageCheck, Store, PartyPopper } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StepIndicator } from "@/components/features/AnimatedStep";
import { WelcomeStep } from "@/components/app/onboarding/WelcomeStep";
import { GhlConnectStep } from "@/components/app/onboarding/GhlConnectStep";
import { SupplierStep } from "@/components/app/onboarding/SupplierStep";
import { CreateStoreStep } from "@/components/app/onboarding/CreateStoreStep";
import { CompletionStep } from "@/components/app/onboarding/CompletionStep";

const steps = [
  { title: "Welcome", icon: Rocket },
  { title: "Connect CRM", icon: Link2 },
  { title: "Supplier", icon: PackageCheck },
  { title: "First Store", icon: Store },
  { title: "Complete", icon: PartyPopper },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tenantId, setTenantId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [storeId, setStoreId] = useState("");

  // Only allow clicking completed steps (no skipping ahead)
  const handleStepClick = (step: number) => {
    if (step < currentStep) setCurrentStep(step);
  };

  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
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
          {/* Sidebar steps */}
          <div className="hidden md:block">
            <StepIndicator
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Step content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <WelcomeStep key="welcome" onNext={() => setCurrentStep(1)} />
              )}
              {currentStep === 1 && (
                <GhlConnectStep
                  key="ghl"
                  onNext={(data) => {
                    setTenantId(data.tenantId);
                    setLocationId(data.locationId);
                    setCurrentStep(2);
                  }}
                  onBack={() => setCurrentStep(0)}
                />
              )}
              {currentStep === 2 && (
                <SupplierStep
                  key="supplier"
                  tenantId={tenantId}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              {currentStep === 3 && (
                <CreateStoreStep
                  key="store"
                  tenantId={tenantId}
                  locationId={locationId}
                  onNext={(data) => {
                    setStoreId(data.storeId);
                    setCurrentStep(4);
                  }}
                  onBack={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 4 && (
                <CompletionStep key="complete" storeId={storeId} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
