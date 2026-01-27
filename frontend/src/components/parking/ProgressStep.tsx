import { Check } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ProgressStepProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  isActive: boolean;
  isLast?: boolean;
}

const ProgressStep = ({
  icon: Icon,
  title,
  subtitle,
  isCompleted,
  isActive,
  isLast = false,
}: ProgressStepProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isCompleted
              ? "bg-success text-success-foreground"
              : isActive
              ? "bg-warning text-warning-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isCompleted ? (
            <Check className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 h-12 mt-2 ${
              isCompleted ? "bg-success" : "bg-border"
            }`}
          />
        )}
      </div>
      <div className="pt-2">
        <p
          className={`font-semibold ${
            isCompleted || isActive ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

export default ProgressStep;