import { useState, useEffect } from "react";
import ParkingCard from "@/components/parking/ParkingCard";
import { StorageService, ParkingSession } from "@/lib/storage";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ParkingSession[]>([]);

  useEffect(() => {
    const sessions = StorageService.getSessions();
    setHistory(sessions);
  }, []);

  const handleParkingClick = (session: ParkingSession) => {
    navigate("/ticket", { state: { session } });
  };

  return (
    <div className="bg-background pb-20">
      <div className="gradient-header px-4 pt-safe pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold text-primary-foreground">Parking History</h1>
        <p className="text-primary-foreground/70 text-sm mt-1">Your past parking sessions</p>
      </div>

      <div className="px-4 mt-6">
        <div className="space-y-3">
          {history.map((parking) => (
            <ParkingCard
              key={parking.id}
              location={parking.location}
              address={parking.address}
              date={new Date(parking.entryTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              vehicleNumber={parking.plateNumber}
              duration={parking.duration || "Active"}
              amount={parking.amount}
              status={parking.status === 'active' ? 'in-progress' : 'completed'}
              onClick={() => handleParkingClick(parking)}
            />
          ))}
          {history.length === 0 && (
            <div className="text-center py-12 bg-muted/20 rounded-2xl">
              <p className="text-muted-foreground">No parking history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;