import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusPillVariants = cva(
  "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
  {
    variants: {
      variant: {
        completed: "bg-success/10 text-success",
        parked: "bg-success/10 text-success",
        retrieve: "bg-warning/10 text-warning",
        "in-progress": "bg-info/10 text-info",
        pending: "bg-muted text-muted-foreground",
        park: "bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "pending",
    },
  }
);

interface StatusPillProps extends VariantProps<typeof statusPillVariants> {
  children: React.ReactNode;
  className?: string;
}

const StatusPill = ({ variant, children, className }: StatusPillProps) => {
  return (
    <span className={cn(statusPillVariants({ variant }), className)}>
      {children}
    </span>
  );
};

export default StatusPill;