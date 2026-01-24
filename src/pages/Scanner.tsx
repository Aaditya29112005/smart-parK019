import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QrCode, ScanLine } from "lucide-react";
import VehicleCard from "@/components/parking/VehicleCard";
import { Button } from "@/components/ui/button";

const initialVehicles = [
  { id: 1, name: "Toyota Camry", plateNumber: "MH 12 AB 1234" },
  { id: 2, name: "Honda Civic", plateNumber: "MH 14 CD 5678" },
];

const Scanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [scanning, setScanning] = useState(true);
  const [vehicles, setVehicles] = useState(initialVehicles);



  // Use a ref or simple effect to add it ensuring uniqueness
  useEffect(() => {
    if (location.state?.newVehicle) {
      setVehicles(prev => {
        if (prev.find(v => v.id === location.state.newVehicle.id)) return prev;
        return [...prev, location.state.newVehicle];
      });
    }
  }, [location.state]);

  // Simulate scanning effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanning((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleVehicleSelect = (vehicle: typeof vehicles[0]) => {
    setSelectedVehicle(vehicle.id);
    navigate("/confirm-parking", { state: { vehicle } });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Scanner Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Camera Background Simulation */}
        <div className="absolute inset-0 bg-black/50 z-0">
          {/* Grid Pattern */}
          <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

        <div className="w-72 h-72 relative z-10">
          {/* Scanner frame corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-3xl shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-3xl shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-3xl shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-3xl shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

          {/* QR icon placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCode className="w-24 h-24 text-white/20 animate-pulse" />
          </div>

          {/* Scanning Line Animation */}
          <div className="absolute left-0 right-0 h-1 bg-primary/80 shadow-[0_0_20px_rgba(59,130,246,1)] animate-scan" style={{ top: '50%' }}>
            <div className="absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-primary/30 to-transparent"></div>
          </div>
        </div>

        <p className="absolute bottom-24 text-white/80 font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
          Align QR code within frame
        </p>
      </div>

      {/* Vehicle Selection Sheet */}
      <div className="bg-card rounded-t-3xl p-6 pt-4 animate-slide-up relative z-20 -mt-6">
        {/* Handle bar */}
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">
            Select Your Vehicle
          </h2>
          <ScanLine className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Choose which vehicle you're parking
        </p>

        <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto pr-2">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              name={vehicle.name}
              plateNumber={vehicle.plateNumber}
              selected={selectedVehicle === vehicle.id}
              onClick={() => handleVehicleSelect(vehicle)}
            />
          ))}
        </div>

        <Button
          onClick={() => navigate("/add-vehicle")}
          className="w-full gradient-primary text-primary-foreground hover:opacity-90"
          size="lg"
        >
          Register New Vehicle
        </Button>
      </div>
    </div>
  );
};

export default Scanner;