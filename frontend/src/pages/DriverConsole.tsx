import { useState, useEffect } from "react";
import { Bell, Car, MapPin, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusPill from "@/components/parking/StatusPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StorageService } from "@/lib/storage";

type AssignmentState = "pending" | "retrieving" | "parked";

const DriverConsole = () => {
  const navigate = useNavigate();
  const [assignmentState, setAssignmentState] = useState<AssignmentState>("pending");
  const [retrievalProgress, setRetrievalProgress] = useState(0);
  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    const loadAssignment = async () => {
      // Look for a session that needs retrieval (completed but recently)
      // For demo purposes, we'll just pick the first completed one
      const sessions = await StorageService.getSessions();
      const completed = sessions.find(s => s.status === 'completed');
      setActiveSession(completed);
    };
    loadAssignment();
  }, []);

  useEffect(() => {
    if (assignmentState === "retrieving") {
      const interval = setInterval(() => {
        setRetrievalProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => navigate("/task-completed"), 500);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [assignmentState, navigate]);

  const handleStartRetrieval = () => {
    setAssignmentState("retrieving");
  };

  if (!activeSession) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <Bell className="w-10 h-10 text-muted-foreground opacity-20" />
        </div>
        <h2 className="text-xl font-bold mb-2">No Active Assignments</h2>
        <p className="text-muted-foreground">You'll be notified when a car needs to be retrieved.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 overflow-y-auto">
      {/* Header */}
      <div className="gradient-header px-4 py-8 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary-foreground/70 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">On Duty</span>
            </div>
            <h2 className="text-primary-foreground text-2xl font-black">Rajesh Kumar</h2>
          </div>
          <button className="relative p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
            <Bell className="w-6 h-6 text-primary-foreground" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-primary rounded-full" />
          </button>
        </div>
      </div>

      {/* Current Assignment */}
      <div className="px-5 -mt-8">
        <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-[0.2em] opacity-60">Current Mission</h3>

        {assignmentState === "retrieving" ? (
          /* Retrieving State */
          <div className="bg-card rounded-3xl p-8 shadow-2xl shadow-primary/10 text-center border border-primary/10">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Car className="w-12 h-12 text-primary animate-bounce" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-1 uppercase tracking-tight">
              Retrieving...
            </h3>
            <p className="text-muted-foreground mb-8 text-sm font-medium">{activeSession.vehicleName} • {activeSession.plateNumber}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                <span>Progress</span>
                <span>{retrievalProgress}%</span>
              </div>
              <Progress value={retrievalProgress} className="h-3 rounded-full bg-muted" />
            </div>
          </div>
        ) : (
          /* Pending Retrieve Assignment */
          <div className="bg-card rounded-3xl p-6 shadow-xl border border-border/50 animate-in slide-in-from-bottom duration-500">
            {/* Vehicle Info */}
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-black text-xl text-foreground leading-tight">{activeSession.vehicleName}</p>
                <p className="text-muted-foreground font-mono text-sm">{activeSession.plateNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="bg-orange-100 text-orange-600 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">High Priority</span>
              </div>
            </div>

            <div className="space-y-5 mb-8">
              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest leading-none mb-1">Parking Slot</p>
                  <p className="font-bold text-foreground">Level 3 • A12</p>
                </div>
              </div>

              {/* Customer */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest leading-none mb-1">Customer</p>
                  <p className="font-bold text-foreground">Priya Verma</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartRetrieval}
              className="w-full h-14 gradient-primary text-primary-foreground text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Accept & Start
            </Button>
          </div>
        )}
      </div>


      {/* Stats Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-card border-t border-border px-4 py-3 pb-safe">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-2xl font-bold text-foreground">12</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Parked</p>
            <p className="text-2xl font-bold text-success">8</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Retrieved</p>
            <p className="text-2xl font-bold text-warning">4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverConsole;