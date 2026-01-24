import { Car, ChevronRight } from "lucide-react";

interface VehicleCardProps {
  name: string;
  plateNumber: string;
  onClick?: () => void;
  selected?: boolean;
}

const VehicleCard = ({ name, plateNumber, onClick, selected }: VehicleCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Car className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{plateNumber}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
};

export default VehicleCard;