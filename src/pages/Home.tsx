import { ChevronRight, QrCode, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/parking/BottomNav";
import ParkingCard from "@/components/parking/ParkingCard";

const recentParkings = [
  {
    id: 1,
    location: "Phoenix Mall",
    address: "Lower Parel, Mumbai",
    date: "8 Dec 2025",
    vehicleNumber: "MH 12 AB 1234",
    duration: "4h 15m",
    amount: 180,
    status: "completed" as const,
  },
  {
    id: 2,
    location: "Central Plaza",
    address: "Andheri West, Mumbai",
    date: "5 Dec 2025",
    vehicleNumber: "MH 14 CD 5678",
    duration: "2h 50m",
    amount: 120,
    status: "completed" as const,
  },
  {
    id: 3,
    location: "City Center Mall",
    address: "Bandra East, Mumbai",
    date: "3 Dec 2025",
    vehicleNumber: "MH 12 AB 1234",
    duration: "4h 30m",
    amount: 200,
    status: "completed" as const,
  },
];

const Home = () => {
  const navigate = useNavigate();

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
          {recentParkings.map((parking) => {
            const { id, ...rest } = parking;
            return (
              <ParkingCard
                key={id}
                {...rest}
                onClick={() => navigate("/ticket")}
              />
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;