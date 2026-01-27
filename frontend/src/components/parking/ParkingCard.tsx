import { MapPin, Clock, ArrowRight } from "lucide-react";
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
      className="bg-card rounded-3xl p-5 shadow-card hover:shadow-xl transition-all cursor-pointer border border-border/50 group active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${status === 'completed' ? 'bg-green-100' : 'bg-primary/10'}`}>
            <MapPin className={`w-5 h-5 ${status === 'completed' ? 'text-green-600' : 'text-primary'}`} />
          </div>
          <div>
            <h3 className="font-bold text-foreground leading-tight">{location}</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{address}</p>
          </div>
        </div>
        <StatusPill variant={status}>
          {status === 'in-progress' ? 'Parked' : status}
        </StatusPill>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-dashed border-border/60">
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Vehicle</p>
          <p className="text-sm font-mono font-bold text-foreground/80">{vehicleNumber}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Paid</p>
          <p className="text-lg font-black text-foreground">₹{amount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">{date}</span>
        </div>
        <div className="flex items-center gap-1 group-hover:gap-2 transition-all">
          <span className="text-[11px] font-bold text-primary">{status === 'in-progress' ? 'VIEW TICKET' : 'DETAILS'}</span>
          <ArrowRight className="w-3 h-3 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default ParkingCard;