import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StepProps {
  number: number;
  title: string;
  icon: LucideIcon;
  isActive: boolean;
  isComplete: boolean;
  onClick: () => void;
}

export const AnimatedStep = ({ number, title, icon: Icon, isActive, isComplete, onClick }: StepProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors w-full text-left ${
        isActive 
          ? "bg-primary/10 border-2 border-primary" 
          : isComplete 
            ? "bg-muted border-2 border-transparent" 
            : "bg-muted/50 border-2 border-transparent hover:bg-muted"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isActive 
          ? "bg-primary text-primary-foreground" 
          : isComplete 
            ? "bg-primary/80 text-primary-foreground" 
            : "bg-muted-foreground/20 text-muted-foreground"
      }`}>
        {isComplete ? (
          <Check className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-muted-foreground">Step {number}</span>
        <p className={`font-medium truncate ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
          {title}
        </p>
      </div>
    </motion.button>
  );
};

interface StepIndicatorProps {
  steps: { title: string; icon: LucideIcon }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <AnimatedStep
          key={index}
          number={index + 1}
          title={step.title}
          icon={step.icon}
          isActive={currentStep === index}
          isComplete={currentStep > index}
          onClick={() => onStepClick(index)}
        />
      ))}
    </div>
  );
};
