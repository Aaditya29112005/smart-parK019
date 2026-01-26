import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Car, MapPin, Clock, CreditCard, Download, Share2, AlertCircle, Hash, CheckCircle2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const handleAction = (action: string) => {
    toast.info(`${action} simulation started...`);
    setTimeout(() => {
      toast.success(`${action} completed!`);
    }, 1500);
  };

  if (!session) {
    return (
      <div className="bg-background flex flex-col items-center justify-center p-4 min-h-full">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Active Ticket</h2>
        <p className="text-muted-foreground text-center mb-6">You don't have an active parking session at the moment.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="bg-background pb-20">
      {/* Ticket Card */}
      <div className="px-4 pt-10">
        <div className="bg-card rounded-3xl shadow-card overflow-hidden">
          {/* Header Status */}
          <div className={`py-4 px-6 flex items-center justify-between ${session.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'}`}>
            <div className="flex items-center gap-2">
              {session.status === 'active' ? (
                <Clock className="w-5 h-5 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              <span className="text-sm font-bold uppercase tracking-widest">
                {session.status === 'active' ? 'Active Parking' : 'Parking Completed'}
              </span>
            </div>
            <span className="text-xs font-mono opacity-70">VALET-01</span>
          </div>

          {/* Ticket Details */}
          <div className="p-6 space-y-6 pt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
                <Hash className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Ticket ID</p>
                <p className="font-bold text-foreground text-lg">{session.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Vehicle</p>
                <p className="font-bold text-foreground">{session.vehicleName}</p>
                <p className="text-xs font-mono bg-muted w-fit px-2 py-0.5 rounded text-muted-foreground">{session.plateNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Entry Time</p>
                <p className="font-bold text-foreground">{new Date(session.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-xs text-muted-foreground">{new Date(session.entryTime).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Simulated QR Code for Ticket */}
            <div className="py-2 border-y border-dashed border-border ticket-cutout flex flex-col items-center gap-3">
              <div className="w-32 h-32 bg-white p-2 rounded-xl border border-border shadow-inner">
                <QrCode className="w-full h-full text-foreground/80" />
              </div>
              <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest">Scan this at the checkout counter</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Location</p>
                  <p className="font-bold text-foreground">{session.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Amount</p>
                <p className="font-bold text-2xl text-primary">₹{session.amount}</p>
              </div>
            </div>
          </div>

          {/* Powered by */}
          <div className="bg-muted px-6 py-4 flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground font-medium">Smart Park Solutions</p>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-muted bg-primary/20" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 mt-8 space-y-4">
        {session.status === 'active' && (
          <Button
            onClick={handleEndParking}
            className="w-full gradient-primary text-primary-foreground hover:opacity-90 h-14 text-lg rounded-2xl shadow-lg shadow-primary/20"
            size="lg"
          >
            <Car className="w-5 h-5 mr-3" />
            Request Retrieval
          </Button>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="rounded-2xl h-12 border-2"
            onClick={() => handleAction("Download")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          <Button
            variant="outline"
            className="rounded-2xl h-12 border-2"
            onClick={() => handleAction("Share")}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};


export default Ticket;