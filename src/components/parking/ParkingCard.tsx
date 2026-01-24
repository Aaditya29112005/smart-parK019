import { MapPin, Clock, Car } from "lucide-react";
import StatusPill from "./StatusPill";

interface ParkingCardProps {
  location: string;
  address: string;
  date: string;
  vehicleNumber: string;
  duration: string;
  amount: number;
  status: "completed" | "parked" | "retrieve" | "in-progress";
  onClick?: () => void;
}

const ParkingCard = ({
  location,
  address,
  date,
  vehicleNumber,
  duration,
  amount,
  status,
  onClick,
}: ParkingCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-foreground">{location}</h3>
        <span className="text-lg font-bold text-foreground">₹{amount}</span>
      </div>
      
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{address}</span>
        <StatusPill variant={status}>{status}</StatusPill>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Car className="w-4 h-4" />
          <span>{vehicleNumber}</span>
        </div>
        <span className="ml-auto text-xs">{duration}</span>
      </div>
    </div>
  );
};

export default ParkingCard;