import { useState, useEffect } from "react";
import { Search, UserPlus, Car, MapPin, Clock, Phone, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/parking/Header";
import StatCard from "@/components/parking/StatCard";
import StatusPill from "@/components/parking/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StorageService, ParkingSession } from "@/lib/storage";
import { toast } from "sonner";

const filters = ["All", "Parked", "Retrieving", "Retrieved"];

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSessions(StorageService.getSessions());
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch =
      session.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.vehicleName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Parked") return session.status === 'active' && matchesSearch;
    if (activeFilter === "Retrieved") return session.status === 'completed' && matchesSearch;
    return matchesSearch;
  });

  const stats = {
    active: sessions.filter(s => s.status === 'active').length,
    retrieving: 0,
    total: sessions.length,
    revenue: sessions.reduce((acc, s) => acc + s.amount, 0)
  };

  const handleCall = (name: string) => {
    toast.success(`Calling ${name}...`);
  };

  return (
    <div className="min-h-screen bg-background pb-32 overflow-y-auto">
      <Header
        title="Manager Dashboard"
        showBack
        variant="default"
        rightAction={
          <Button
            onClick={() => navigate("/add-driver")}
            size="sm"
            className="gradient-primary text-primary-foreground"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Add Driver
          </Button>
        }
      />

      <div className="px-4 pt-4">
        <p className="text-muted-foreground mb-4 font-medium">
          Manage valet assignments and parking operations
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Active Cars" value={stats.active} />
          <StatCard label="Retrieving" value={stats.retrieving} />
          <StatCard label="Total Today" value={stats.total} />
          <StatCard label="Revenue" value={stats.revenue} prefix="₹" />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by plate or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-card border-none shadow-sm focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === filter
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Assignment Cards */}
        <div className="space-y-4">
          {filteredSessions.map((assignment) => (
            <div key={assignment.id} className="bg-card rounded-2xl p-4 shadow-card border border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Vehicle Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{assignment.vehicleName}</p>
                    <p className="text-sm font-mono text-muted-foreground uppercase tracking-tight">{assignment.plateNumber}</p>
                  </div>
                </div>
                <StatusPill variant={assignment.status === 'active' ? 'parked' : 'completed'}>
                  {assignment.status === 'active' ? 'Parked' : 'Completed'}
                </StatusPill>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Entry</p>
                    <p className="text-xs font-semibold">{new Date(assignment.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleCall("Valet")}
                    className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-success" />
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-bold text-foreground/80">{assignment.location}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-8 text-primary font-bold hover:bg-primary/10">
                  <Edit className="w-3 h-3 mr-1" />
                  REASSIGN
                </Button>
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground font-medium">No sessions found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;