import BottomNav from "@/components/parking/BottomNav";
import ParkingCard from "@/components/parking/ParkingCard";

const parkingHistory = [
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
  {
    id: 4,
    location: "Inorbit Mall",
    address: "Malad West, Mumbai",
    date: "1 Dec 2025",
    vehicleNumber: "MH 12 AB 1234",
    duration: "3h 15m",
    amount: 150,
    status: "completed" as const,
  },
];

const History = () => {
  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="gradient-header px-4 py-6 rounded-b-3xl">
        <h1 className="text-xl font-bold text-primary-foreground">Parking History</h1>
        <p className="text-primary-foreground/70 text-sm mt-1">Your past parking sessions</p>
      </div>

      <div className="px-4 mt-6">
        <div className="space-y-3">
          {parkingHistory.map((parking) => (
            <ParkingCard key={parking.id} {...parking} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default History;