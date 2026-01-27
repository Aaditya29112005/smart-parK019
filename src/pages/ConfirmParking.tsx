import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Car, MapPin, Smartphone, Landmark, CreditCard, Wallet, Loader2, CheckCircle2 } from "lucide-react";
import Header from "@/components/parking/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StorageService } from "@/lib/storage";
import { toast } from "sonner";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, color: "text-purple-500 bg-purple-50" },
  { id: "netbanking", label: "Netbanking", icon: Landmark, color: "text-blue-500 bg-blue-50" },
  { id: "card", label: "Card", icon: CreditCard, color: "text-green-500 bg-green-50" },
  { id: "wallet", label: "Wallet", icon: Wallet, color: "text-red-500 bg-red-50" },
];

const ConfirmParking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get vehicle and location from state
  const vehicle = location.state?.vehicle || {
    id: 1,
    name: "Toyota Camry",
    plateNumber: "MH 12 AB 1234",
    ownerName: "John Doe"
  };
  const locationName = location.state?.location || "Inorbit Mall";

  const costBreakdown = {
    baseRate: 120,
    serviceFee: 20,
    gst: 10,
    total: 150
  };

  const handleConfirmPay = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const session = StorageService.startSession(vehicle, locationName);
      setIsProcessing(false);
      toast.success("Payment Successful!");
      navigate("/ticket", { state: { session, vehicle } });
    }, 2000);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Processing Payment</h2>
        <p className="text-muted-foreground">Please do not refresh or close the app...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header title="Confirm Parking" showBack />

      {/* Progress bar */}
      <div className="px-4 py-2">
        <Progress value={80} className="h-1" />
      </div>

      {/* Vehicle Details Card */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Car className="w-5 h-5" />
            <span className="font-medium">Vehicle Details</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner</span>
              <span className="font-medium text-foreground">{vehicle.ownerName || "John Doe"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle</span>
              <span className="font-medium text-foreground">{vehicle.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number Plate</span>
              <span className="font-medium text-foreground font-mono bg-muted px-2 py-0.5 rounded text-sm">{vehicle.plateNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-4 mt-6">
        <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPayment === method.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
                }`}
            >
              <div className={`w-10 h-10 rounded-xl ${method.color} flex items-center justify-center`}>
                <method.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {method.label}
              </p>
              {selectedPayment === method.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-primary fill-background" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Details */}
      <div className="px-4 mt-6">
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Price Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Base Parking (4 Hours)</span>
              <span className="text-foreground">₹{costBreakdown.baseRate}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Valet Service Fee</span>
              <span className="text-foreground">₹{costBreakdown.serviceFee}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground pb-3 border-b border-dashed">
              <span>GST (5%)</span>
              <span className="text-foreground">₹{costBreakdown.gst}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-1">
              <span>Total Amount</span>
              <span className="text-primary">₹{costBreakdown.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-background border-t border-border z-30 pb-safe">
        <Button
          onClick={handleConfirmPay}
          className="w-full gradient-primary text-primary-foreground hover:opacity-90 h-14 text-lg rounded-2xl"
          size="lg"
        >
          Confirm & Pay ₹{costBreakdown.total}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmParking;