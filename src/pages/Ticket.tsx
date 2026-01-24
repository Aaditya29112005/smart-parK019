import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Car, MapPin, Clock, CreditCard, Download, Share2, AlertCircle, Hash, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/parking/BottomNav";
import { StorageService, ParkingSession } from "@/lib/storage";
import { toast } from "sonner";

const Ticket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<ParkingSession | null>(null);

  useEffect(() => {
    // Priority: 1. State from navigation, 2. Get active session from storage
    const stateSession = location.state?.session;
    if (stateSession) {
      setSession(stateSession);
    } else {
      const active = StorageService.getActiveSession();
      setSession(active);
    }
  }, [location.state]);

  const handleEndParking = () => {
    if (session) {
      StorageService.completeSession(session.id);
      navigate("/retrieval", { state: { session } });
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Active Ticket</h2>
        <p className="text-muted-foreground text-center mb-6">You don't have an active parking session at the moment.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Ticket Card */}
      <div className="px-4 pt-6">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {/* Header Status */}
          <div className={`py-3 px-5 flex items-center gap-2 ${session.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'}`}>
            {session.status === 'active' ? (
              <Clock className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span className="text-sm font-medium uppercase tracking-wider">
              {session.status === 'active' ? 'Active Parking' : 'Parking Completed'}
            </span>
          </div>

          {/* Ticket Details */}
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Ticket ID</p>
                <p className="font-semibold text-foreground">{session.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <Car className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="font-semibold text-foreground">{session.vehicleName}</p>
                <p className="text-sm text-muted-foreground">{session.plateNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">{session.location}</p>
                <p className="text-sm text-muted-foreground">{session.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Entry Time</p>
                <p className="font-semibold text-foreground">{new Date(session.entryTime).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  Duration: {session.duration || "Currently Parked"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-bold text-xl text-foreground">₹{session.amount}</p>
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
        {session.status === 'active' && (
          <Button
            onClick={handleEndParking}
            className="w-full gradient-primary text-primary-foreground hover:opacity-90"
            size="lg"
          >
            <Car className="w-5 h-5 mr-2" />
            End Parking
          </Button>
        )}

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
      {session.status === 'active' && (
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
      )}

      <BottomNav />
    </div>
  );
};

export default Ticket;