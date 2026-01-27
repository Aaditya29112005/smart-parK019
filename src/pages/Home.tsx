import { useState, useEffect } from "react";
import { ChevronRight, QrCode, Trophy, Car, MapPin, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParkingCard from "@/components/parking/ParkingCard";
import { StorageService, ParkingSession } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import LiveMap from "@/components/parking/LiveMap";

const Home = () => {
  const navigate = useNavigate();
  const [recentSessions, setRecentSessions] = useState<ParkingSession[]>([]);
  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const sessions = StorageService.getSessions();
    setRecentSessions(sessions.slice(0, 5));
    setActiveSession(StorageService.getActiveSession());
  }, []);

  const handleParkingClick = (session: ParkingSession) => {
    navigate("/ticket", { state: { session } });
  };

  return (
    <div className="bg-background">
      {/* Premium Header */}
      <div className="gradient-header px-6 pt-16 pb-20 rounded-b-[3rem] relative">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Good Morning</p>
            <h1 className="text-primary-foreground text-3xl font-black">Find Space</h1>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-white/30 transition-colors">
            <Search className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>

        {/* Search Bar / Map Toggle */}
        {!showMap ? (
          <div
            onClick={() => setShowMap(true)}
            className="w-full bg-white/10 backdrop-blur-md rounded-[2.5rem] p-4 border border-white/20 shadow-xl mb-4 flex items-center gap-4 cursor-pointer hover:bg-white/20 transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-primary-foreground/50 text-[10px] font-black uppercase tracking-widest">Quick View</p>
              <h3 className="text-primary-foreground text-sm font-black uppercase">Search parking near me</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary-foreground/50">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ) : (
          <div className="relative h-[220px] w-full bg-white/10 backdrop-blur-md rounded-[2.5rem] p-1 border border-white/20 overflow-hidden shadow-xl mb-4 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-14 z-30 w-11 h-11 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <LiveMap />
          </div>
        )}

        {/* Floating Active Card */}
        {activeSession && (
          <div className="absolute left-6 right-6 -bottom-10 z-10 animate-in slide-in-from-bottom-4 duration-700">
            <div
              onClick={() => navigate("/ticket")}
              className="bg-white rounded-[2rem] p-5 shadow-2xl flex items-center justify-between border border-primary/5 cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center relative">
                  <Car className="w-7 h-7 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-4 border-white rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">Ongoing Session</span>
                  </div>
                  <h3 className="font-black text-foreground text-lg leading-tight uppercase">{activeSession.vehicleName}</h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">{activeSession.location}</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {!activeSession && (
          <div className="absolute left-6 right-6 -bottom-10 z-10">
            <div className="bg-primary-foreground rounded-[2rem] p-6 shadow-2xl border border-primary/5 flex items-center gap-4">
              <div className="flex-1">
                <h3 className="font-black text-primary text-lg leading-tight uppercase">Ready to park?</h3>
                <p className="text-muted-foreground text-xs font-bold leading-relaxed mt-1">Scan the QR code at any of our outlets to begin.</p>
              </div>
              <Button
                onClick={() => navigate("/scanner")}
                className="bg-primary text-white rounded-2xl px-6 h-12 font-black uppercase text-xs"
              >
                Scan Now
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 mt-16 pb-2">
        {/* Quick Actions / Featured Sites */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { label: 'Valet Info', icon: Trophy, active: true },
            { label: 'Fast Pass', icon: QrCode, active: false },
            { label: 'Our Sites', icon: MapPin, active: false },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] whitespace-nowrap border cursor-pointer transition-all ${item.active ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-105 ml-1' : 'bg-card border-border/50 text-muted-foreground hover:bg-muted'}`}>
              <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-primary'}`} />
              <span className={`text-xs font-black uppercase tracking-wider ${item.active ? 'text-white' : ''}`}>{item.label}</span>
            </div>
          ))}
        </div>


        {/* History Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Recent Sessions</h2>
          <button
            onClick={() => navigate("/history")}
            className="text-xs font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentSessions.map((session) => (
            <ParkingCard
              key={session.id}
              location={session.location}
              address={session.address}
              date={new Date(session.entryTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              vehicleNumber={session.plateNumber}
              duration={session.duration || "Active"}
              amount={session.amount}
              status={session.status === 'active' ? 'in-progress' : 'completed'}
              onClick={() => handleParkingClick(session)}
            />
          ))}
          {recentSessions.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/50">
              <Car className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em]">No history found</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Home;