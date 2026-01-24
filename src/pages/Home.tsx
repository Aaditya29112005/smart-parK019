import { useState, useEffect } from "react";
import { ChevronRight, QrCode, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/parking/BottomNav";
import ParkingCard from "@/components/parking/ParkingCard";
import { StorageService, ParkingSession } from "@/lib/storage";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const [recentSessions, setRecentSessions] = useState<ParkingSession[]>([]);

  useEffect(() => {
    // Show only completed or recent active session
    const sessions = StorageService.getSessions();
    setRecentSessions(sessions.slice(0, 3));
  }, []);

  const handleParkingClick = (session: ParkingSession) => {
    navigate("/ticket", { state: { session } });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Welcome Header */}
      <div className="gradient-header px-4 pt-6 pb-4 rounded-b-3xl">
        <p className="text-primary-foreground/90 text-sm">Welcome back!</p>
      </div>

      {/* Premium Banner */}
      <div className="px-4 -mt-2">
        <div className="gradient-primary rounded-2xl p-4 relative overflow-hidden shadow-card">
          <div className="flex items-center gap-1 text-yellow-300 text-xs mb-2">
            <Trophy className="w-4 h-4" />
            <span>#1 IN INDIA</span>
          </div>
          <h2 className="text-primary-foreground text-xl font-bold">
            Premium Parking Solution
          </h2>
          <p className="text-primary-foreground/80 text-sm">
            Trusted by 1M+ users nationwide
          </p>
          {/* Car illustration */}
          <div className="absolute right-4 top-4 w-20 h-16 flex items-center justify-center bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="relative">
              <div className="absolute -inset-1 bg-yellow-400/50 rounded-full blur opacity-70 animate-pulse"></div>
              <Trophy className="w-10 h-10 text-yellow-300 relative z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Session Callout (Optional) */}
      {recentSessions.some(s => s.status === 'active') && (
        <div className="px-4 mt-4">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-primary font-medium uppercase tracking-wider">Active Parking</p>
              <h3 className="font-semibold">{recentSessions.find(s => s.status === 'active')?.vehicleName}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => navigate("/ticket")}
            >
              View Ticket
            </Button>
          </div>
        </div>
      )}

      {/* Scan to Park */}
      <div className="px-4 mt-4">
        <button
          onClick={() => navigate("/scanner")}
          className="w-full bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-foreground">Scan to Park</h3>
            <p className="text-sm text-muted-foreground">
              Scan QR code at parking entrance
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Recent Parking */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent Parking
        </h2>
        <div className="space-y-3">
          {recentSessions.map((session) => (
            <ParkingCard
              key={session.id}
              location={session.location}
              address={session.address}
              date={new Date(session.entryTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              vehicleNumber={session.plateNumber}
              duration={session.duration || "Active"}
              amount={session.amount}
              status={session.status === 'active' ? 'in-progress' : 'completed'}
              onClick={() => handleParkingClick(session)}
            />
          ))}
          {recentSessions.length === 0 && (
            <p className="text-center text-muted-foreground py-8 bg-muted/20 rounded-2xl">
              No recent parking history
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;