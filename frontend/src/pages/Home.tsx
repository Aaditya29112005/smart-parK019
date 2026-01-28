import { useState, useEffect } from "react";
import { ChevronRight, QrCode, Trophy, Car, MapPin, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParkingCard from "@/components/parking/ParkingCard";
import { StorageService, ParkingSession } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import LiveMap from "@/components/parking/LiveMap";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { DynamicIsland } from "@/components/ui/DynamicIsland";

const Home = () => {
  const navigate = useNavigate();
  const [recentSessions, setRecentSessions] = useState<ParkingSession[]>([]);
  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null);
  const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalHours: 0, activeCount: 0, historyCount: 0 });

  const refreshData = async () => {
    const sessions = await StorageService.getSessions();
    setRecentSessions(sessions.slice(0, 5));
    setActiveSession(await StorageService.getActiveSession());
    setAnalytics(await StorageService.getAnalytics());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('smart_park_data_updated', refreshData);
    return () => window.removeEventListener('smart_park_data_updated', refreshData);
  }, []);

  const handleParkingClick = (session: ParkingSession) => {
    navigate("/ticket", { state: { session } });
  };

  return (
    <div className="bg-background bg-aurora min-h-screen relative overflow-x-hidden">
      {/* Dynamic Status Island */}
      <DynamicIsland state={activeSession ? 'active-session' : 'idle'} />

      {/* Premium Header */}
      <div className="gradient-header px-6 pt-24 pb-24 rounded-b-[3.5rem] relative shadow-2xl z-10 block">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Good Morning</p>
            <h1 className="text-primary-foreground text-4xl font-black tracking-tight">Pixel Park</h1>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-lg"
          >
            <Search className="w-6 h-6 text-primary-foreground" />
          </motion.div>
        </div>

        {/* Search Bar - Navigates to Map View */}
        <Tilt
          tiltMaxAngleX={5}
          tiltMaxAngleY={5}
          perspective={1000}
          scale={1.02}
          className="perspective-1000"
        >
          <div
            onClick={() => navigate("/map")}
            className="glass-panel rounded-[2.5rem] p-5 shadow-2xl mb-4 flex items-center gap-4 cursor-pointer hover:bg-white/40 transition-all group relative overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />

            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-primary-foreground/60 text-[10px] font-black uppercase tracking-widest">Quick Navigation</p>
              <h3 className="text-white text-lg font-black uppercase tracking-tight">Find Parking Space</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </Tilt>

        {/* Floating Active Card */}
        {activeSession && (
          <div className="absolute left-6 right-6 -bottom-12 z-20">
            <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.02}>
              <div
                onClick={() => navigate("/ticket")}
                className="glass-panel bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border-white/50 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center relative shadow-lg shadow-primary/20">
                    <Car className="w-8 h-8 text-white relative z-10" />
                    <div className="absolute inset-0 bg-primary rounded-2xl animate-ping opacity-20" />
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-400 border-[3px] border-white rounded-full z-20" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">Live Session</span>
                    </div>
                    <h3 className="font-black text-slate-800 text-xl leading-tight uppercase mt-1">{activeSession.vehicleName}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold uppercase tracking-tight">{activeSession.location}</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </Tilt>
          </div>
        )}

        {!activeSession && (
          <div className="absolute left-6 right-6 -bottom-10 z-20">
            <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01}>
              <div className="glass-panel bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border-white/50 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-black text-slate-800 text-lg leading-tight uppercase">Ready to park?</h3>
                  <p className="text-slate-500 text-xs font-bold leading-relaxed mt-1">Scan the QR code to begin.</p>
                </div>
                <Button
                  onClick={() => navigate("/scanner")}
                  className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 h-12 font-black uppercase text-xs shadow-lg shadow-primary/25"
                >
                  Scan
                </Button>
              </div>
            </Tilt>
          </div>
        )}
      </div>

      <div className="px-6 mt-20 pb-2 relative z-0">
        {/* Quick Actions / Intelligence Dashboard */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Tilt scale={1.05} tiltMaxAngleX={10} tiltMaxAngleY={10}>
            <div className="glass-panel bg-white/60 rounded-3xl p-4 flex flex-col items-center justify-center text-center h-full border-white/60 shadow-sm hover:shadow-xl transition-all">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Revenue</span>
              <p className="text-lg font-black text-primary">₹{analytics.totalRevenue}</p>
            </div>
          </Tilt>
          <Tilt scale={1.05} tiltMaxAngleX={10} tiltMaxAngleY={10}>
            <div className="glass-panel bg-white/60 rounded-3xl p-4 flex flex-col items-center justify-center text-center h-full border-white/60 shadow-sm hover:shadow-xl transition-all">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Active</span>
              <p className="text-lg font-black text-primary">{analytics.activeCount}</p>
            </div>
          </Tilt>
          <Tilt scale={1.05} tiltMaxAngleX={10} tiltMaxAngleY={10}>
            <div className="glass-panel bg-white/60 rounded-3xl p-4 flex flex-col items-center justify-center text-center h-full border-white/60 shadow-sm hover:shadow-xl transition-all">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">History</span>
              <p className="text-lg font-black text-primary">{analytics.historyCount}</p>
            </div>
          </Tilt>
        </div>

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

        <div className="space-y-4 mb-10">
          {recentSessions.map((session) => (
            <ParkingCard
              key={session.id}
              location={session.location}
              address={session.address}
              date={new Date(session.entryTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              vehicleNumber={session.plateNumber}
              duration={session.duration}
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

        {/* Operational Activity Feed */}
        <div className="mt-12 mb-20 px-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-4 bg-primary rounded-full" />
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Live Intelligence</h2>
          </div>

          <div className="space-y-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100" />

            {/* Real Session Feed Item */}
            {recentSessions.length > 0 && (
              <div className="relative pl-10 flex flex-col gap-1">
                <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-4 border-white bg-primary shadow-sm" />
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">{recentSessions[0].status === 'active' ? 'Deployment Active' : 'Operation Closed'}</span>
                <p className="text-sm font-bold text-slate-800 uppercase">{recentSessions[0].vehicleName} at {recentSessions[0].location}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase opacity-60">Handled by Unit Valet-01</p>
              </div>
            )}

            {/* Mock Background Events */}
            <div className="relative pl-10 flex flex-col gap-1">
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-4 border-white bg-green-400 shadow-sm" />
              <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Driver Approved</span>
              <p className="text-sm font-bold text-slate-800 uppercase">Rajesh Kumar verified</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase opacity-60">Status: Protocol-Alpha</p>
            </div>

            <div className="relative pl-10 flex flex-col gap-1">
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-4 border-white bg-amber-400 shadow-sm" />
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Zone Alert</span>
              <p className="text-sm font-bold text-slate-800 uppercase">Jio World Drive reaching 95%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase opacity-60">Redirect protocol standby</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;