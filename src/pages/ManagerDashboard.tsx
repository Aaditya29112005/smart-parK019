import { useState } from "react";
import { Search, UserPlus, Car, MapPin, Clock, Phone, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/parking/Header";
import StatCard from "@/components/parking/StatCard";
import StatusPill from "@/components/parking/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const filters = ["All", "Parked", "Retrieving", "Retrieved"];

const assignments = [
  {
    id: 1,
    vehicle: "Honda City",
    plateNumber: "MH02AB1234",
    status: "parked" as const,
    customer: "Amit Sharma",
    valet: "Rajesh Kumar",
    valetId: "V001",
    location: "Phoenix Mall",
    address: "Lower Parel, Mumbai",
    entryTime: "23 Jan, 02:56 pm",
    duration: "2h 0m",
  },
];

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="min-h-screen bg-background pb-6">
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
        <p className="text-muted-foreground mb-4">
          Manage valet assignments and parking operations
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Active Cars" value={3} />
          <StatCard label="Retrieving" value={1} />
          <StatCard label="Total Today" value={5} />
          <StatCard label="Revenue" value={825} prefix="₹" />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search by plate, customer or valet..." 
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-foreground text-background"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              {filter} {filter === "All" && "(5)"}
              {filter === "Parked" && "(3)"}
              {filter === "Retrieving" && "(1)"}
            </button>
          ))}
        </div>

        {/* Assignment Cards */}
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-card rounded-2xl p-4 shadow-card">
              {/* Vehicle Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-foreground">{assignment.vehicle}</p>
                    <p className="text-sm text-muted-foreground">{assignment.plateNumber}</p>
                  </div>
                </div>
                <StatusPill variant={assignment.status}>Parked</StatusPill>
              </div>

              {/* Customer */}
              <div className="flex items-center gap-2 mb-2 text-sm">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium text-foreground">{assignment.customer}</span>
              </div>

              {/* Valet */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Valet Assigned</p>
                  <p className="font-medium text-foreground">{assignment.valet}</p>
                  <p className="text-xs text-muted-foreground">ID: {assignment.valetId}</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                  <Phone className="w-5 h-5 text-success-foreground" />
                </button>
              </div>

              {/* Reassign Button */}
              <Button variant="outline" className="w-full mb-4" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Reassign Valet
              </Button>

              {/* Location */}
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{assignment.location}</p>
                  <p className="text-xs text-muted-foreground">{assignment.address}</p>
                </div>
              </div>

              {/* Entry Time */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Entry Time</p>
                  <p className="font-medium text-foreground">{assignment.entryTime}</p>
                  <p className="text-xs text-muted-foreground">Duration: {assignment.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;