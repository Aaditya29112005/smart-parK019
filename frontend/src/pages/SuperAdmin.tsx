import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, TrendingUp, Ticket, DollarSign, MapPin, Check, User, CheckCircle2, XCircle, Phone, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StorageService } from "@/lib/storage";

const sites = [
  { id: "phoenix", name: "Phoenix Mall - Lower Parel" },
  { id: "inorbit", name: "Inorbit Mall - Malad" },
  { id: "infiniti", name: "Infiniti Mall - Andheri" },
];

const SuperAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "approvals">("overview");
  const [selectedSite, setSelectedSite] = useState("phoenix");
  const [stats, setStats] = useState({
    totalTickets: 0,
    totalRevenue: 0,
    activeParking: 0,
  });

  const [pendingDrivers, setPendingDrivers] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Stats
    const sessions = await StorageService.getSessions();
    setStats({
      totalTickets: sessions.length,
      totalRevenue: sessions.reduce((acc, s) => acc + s.amount, 0),
      activeParking: sessions.filter(s => s.status === 'active').length,
    });

    // Drivers
    const drivers = await StorageService.getDrivers();
    setPendingDrivers(drivers.filter(d => d.status === 'pending'));
  };

  const handleApproval = async (id: number, status: 'approved' | 'rejected') => {
    await StorageService.updateDriverStatus(id, status);
    await loadData(); // Reload list
  };

  return (
    <div className="bg-gradient-to-b from-accent/20 to-background pb-10">
      {/* Header */}
      <div className="gradient-header px-4 pt-safe pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-primary-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-primary-foreground">Super Admin</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm ml-8">
          System overview and approvals
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="px-4 mt-4">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${activeTab === "overview"
              ? "gradient-primary text-primary-foreground"
              : "bg-card border border-border text-foreground"
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("approvals")}
            className={`flex-1 py-3 rounded-xl font-medium transition-all relative ${activeTab === "approvals"
              ? "gradient-primary text-primary-foreground"
              : "bg-card border border-border text-foreground"
              }`}
          >
            Approvals
            {pendingDrivers.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                {pendingDrivers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "overview" ? (
        <div className="px-4 mt-6">
          {/* Site Selector */}
          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block">Select Site</label>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-full bg-card">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Today's Performance */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-foreground" />
              <h3 className="font-semibold text-foreground">Today's Performance</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl p-4 shadow-card">
                <p className="text-sm text-muted-foreground">Tickets Issued</p>
                <p className="text-3xl font-bold text-primary mt-1">{stats.totalTickets}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card">
                <p className="text-sm text-muted-foreground">Collection</p>
                <p className="text-3xl font-bold text-success mt-1">₹{stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-foreground" />
              <h3 className="font-semibold text-foreground">Overall Statistics</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Total Tickets</span>
                </div>
                <span className="text-xl font-bold text-foreground">{stats.totalTickets * 15}</span>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-success" />
                  <span className="text-foreground">Total Collection</span>
                </div>
                <span className="text-xl font-bold text-foreground">₹{stats.totalRevenue * 15}</span>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-info" />
                  <span className="text-foreground">Active Parking</span>
                </div>
                <span className="text-xl font-bold text-foreground">{stats.activeParking}</span>
              </div>
            </div>
          </div>

          {/* Current Site Card */}
          <div className="bg-gradient-to-r from-accent/30 to-primary/10 rounded-xl p-4">
            <h4 className="font-semibold text-foreground">{sites.find(s => s.id === selectedSite)?.name}</h4>
            <p className="text-sm text-muted-foreground">Authorized Area</p>
          </div>
        </div>
      ) : (
        <div className="px-4 mt-6 pb-20">
          <h3 className="font-semibold text-foreground mb-6">Pending Driver Approvals</h3>

          <div className="space-y-4">
            {pendingDrivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
                {/* Decorative status bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>

                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                    {driver.avatarUrl ? (
                      <img src={driver.avatarUrl} alt={driver.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">{driver.fullName}</h4>
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                      <Phone className="w-3 h-3" />
                      {driver.phone}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <FileText className="w-3 h-3" />
                      {driver.licenseNumber}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 mb-4 pl-1">
                  Submitted by Manager on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1 bg-slate-50 text-slate-600 hover:bg-slate-100 h-10 rounded-lg text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleApproval(driver.id, 'approved')}
                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white h-10 rounded-lg text-xs font-semibold shadow-md shadow-green-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleApproval(driver.id, 'rejected')}
                    className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white h-10 rounded-lg text-xs font-semibold shadow-md shadow-red-100"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}

            {pendingDrivers.length === 0 && (
              <div className="bg-card rounded-2xl p-8 shadow-card text-center">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-accent" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">All Caught Up!</h4>
                <p className="text-muted-foreground">
                  No pending driver approvals at the moment
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;