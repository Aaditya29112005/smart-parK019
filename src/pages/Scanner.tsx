import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, ScanLine, MapPin, Loader2, Car } from "lucide-react";
import VehicleCard from "@/components/parking/VehicleCard";
import { Button } from "@/components/ui/button";
import { StorageService, Vehicle } from "@/lib/storage";
import { toast } from "sonner";

const Scanner = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [scanning, setScanning] = useState(true);
  const [isDetecting, setIsDetecting] = useState(true);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    setVehicles(StorageService.getVehicles());

    // Simulate location detection
    const timer = setTimeout(() => {
      setIsDetecting(false);
      setDetectedLocation("Inorbit Mall - Malad");
      toast.info("Location detected: Inorbit Mall");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Simulate scanning effect
  useEffect(() => {
    if (!isDetecting) {
      const interval = setInterval(() => {
        setScanning((prev) => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isDetecting]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle.id);

    // Slight delay for feedback
    setTimeout(() => {
      navigate("/confirm-parking", { state: { vehicle, location: detectedLocation } });
    }, 500);
  };

  return (
    <div className="bg-slate-900 flex flex-col pt-8">
      {/* Scanner Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Camera Background Simulation */}
        <div className="absolute inset-0 bg-black/50 z-0">
          <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

        {isDetecting ? (
          <div className="z-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <p className="text-white font-medium tracking-wide">Detecting Location...</p>
            <p className="text-white/40 text-xs mt-1">Accessing GPS data</p>
          </div>
        ) : (
          <div className="w-72 h-72 relative z-10 animate-in fade-in zoom-in duration-700">
            {/* Scanner frame corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)]" />

            <div className="absolute inset-0 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-white/10 animate-pulse" />
            </div>

            <div className="absolute left-0 right-0 h-1 bg-primary/80 shadow-[0_0_20px_rgba(59,130,246,1)] animate-scan" style={{ top: '50%' }}>
              <div className="absolute left-0 right-0 top-0 h-12 bg-gradient-to-b from-primary/40 to-transparent"></div>
            </div>
          </div>
        )}

        {!isDetecting && (
          <div className="absolute bottom-24 bg-black/60 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2 animate-in slide-in-from-bottom duration-500">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-white text-sm font-medium">{detectedLocation}</span>
          </div>
        )}
      </div>

      {/* Vehicle Selection Sheet */}
      <div className="bg-card rounded-t-[2.5rem] p-6 pt-4 animate-slide-up relative z-20 -mt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Vehicle Selection
          </h2>
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Car className="w-4 h-4 text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Choose a registered vehicle to proceed
        </p>

        <div className="space-y-3 mb-8 max-h-[240px] overflow-y-auto pr-1">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              name={vehicle.name}
              plateNumber={vehicle.plateNumber}
              selected={selectedVehicle === vehicle.id}
              onClick={() => handleVehicleSelect(vehicle)}
            />
          ))}
          {vehicles.length === 0 && (
            <div className="text-center py-8 rounded-2xl bg-muted/30 border border-dashed border-border">
              <p className="text-sm text-muted-foreground">No vehicles found</p>
            </div>
          )}
        </div>

        <Button
          onClick={() => navigate("/add-vehicle")}
          variant="outline"
          className="w-full border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 h-12 rounded-xl mb-2"
        >
          + Register New Vehicle
        </Button>
      </div>
    </div>
  );
};

export default Scanner;