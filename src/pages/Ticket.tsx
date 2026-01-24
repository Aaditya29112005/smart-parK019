import { useNavigate, useLocation } from "react-router-dom";
import { Car, MapPin, Clock, CreditCard, Download, Share2, AlertCircle, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/parking/BottomNav";

const Ticket = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get vehicle from state
  const vehicle = location.state?.vehicle || {
    name: "Toyota Camry",
    plateNumber: "MH 12 AB 1234"
  };

  // Remove BottomNav from this page since we have RoleSwitcher

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Ticket Card */}
      <div className="px-4 pt-6">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {/* Ticket Details */}
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Ticket ID</p>
                <p className="font-semibold text-foreground">TK-{new Date().toISOString().slice(0, 10)}-{Math.floor(Math.random() * 1000)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <Car className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="font-semibold text-foreground">{vehicle.name}</p>
                <p className="text-sm text-muted-foreground">{vehicle.plateNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">Inorbit Mall</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Entry Time</p>
                <p className="font-semibold text-foreground">{new Date().toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Duration: Starts Now</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Amount Paid</p>
                <p className="font-bold text-xl text-foreground">₹150</p>
              </div>
            </div>
          </div>

          {/* Powered by */}
          <div className="bg-muted/30 py-3 text-center">
            <p className="text-sm text-muted-foreground">Powered by Smart Parking</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mt-6 space-y-3">
        <Button
          onClick={() => navigate("/retrieval")}
          className="w-full gradient-primary text-primary-foreground hover:opacity-90"
          size="lg"
        >
          <Car className="w-5 h-5 mr-2" />
          Get My Car
        </Button>

        <Button
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Ticket
        </Button>

        <Button
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Ticket
        </Button>
      </div>

      {/* Info Banner */}
      <div className="px-4 mt-6">
        <div className="bg-warning/10 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warning">Keep this ticket handy</p>
            <p className="text-sm text-warning/80">
              Show this QR code when retrieving your vehicle
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Ticket;