import { useState, useEffect } from "react";
import { Bell, Car, MapPin, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusPill from "@/components/parking/StatusPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type AssignmentState = "pending" | "retrieving" | "parked";

const DriverConsole = () => {
  const navigate = useNavigate();
  const [assignmentState, setAssignmentState] = useState<AssignmentState>("pending");
  const [retrievalProgress, setRetrievalProgress] = useState(0);

  useEffect(() => {
    if (assignmentState === "retrieving") {
      const interval = setInterval(() => {
        setRetrievalProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            navigate("/task-completed");
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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-header px-4 py-6 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm">Driver Console</p>
            <p className="text-primary-foreground/70 text-sm mt-1">Welcome back,</p>
            <h2 className="text-primary-foreground text-xl font-bold">Rajesh Kumar</h2>
          </div>
          <button className="relative p-2">
            <Bell className="w-6 h-6 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Current Assignment */}
      <div className="px-4 mt-6">
        <h3 className="font-semibold text-foreground mb-4">Current Assignment</h3>

        {assignmentState === "retrieving" ? (
          /* Retrieving State */
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Retrieving Vehicle...
            </h3>
            <p className="text-muted-foreground mb-1">Maruti Swift</p>
            <p className="text-sm text-muted-foreground mb-6">MH12CD5678</p>
            <Progress value={retrievalProgress} className="h-2" />
          </div>
        ) : (
          /* Pending Retrieve Assignment */
          <div className="bg-card rounded-2xl p-4 shadow-card">
            {/* Vehicle Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Car className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg text-foreground">Maruti Swift</p>
                <p className="text-muted-foreground">MH12CD5678</p>
              </div>
            </div>
            
            <StatusPill variant="retrieve" className="mb-4">Retrieve Vehicle</StatusPill>

            <div className="border-t border-border pt-4 space-y-3">
              {/* Customer */}
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium text-foreground">Priya Verma</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">Phoenix Mall</p>
                  <p className="text-sm text-muted-foreground">Lower Parel, Mumbai</p>
                </div>
              </div>

              {/* Retrieve From */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Retrieve from</p>
                  <p className="font-medium text-foreground">Level 3 - A12</p>
                </div>
              </div>

              {/* Assigned At */}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Assigned at</p>
                  <p className="font-medium text-foreground">04:52 pm</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartRetrieval}
              className="w-full mt-4 gradient-primary text-primary-foreground"
            >
              Start Retrieval
            </Button>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-card border-t border-border px-4 py-3">
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