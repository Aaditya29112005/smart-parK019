import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Car, MapPin, Smartphone, Landmark, CreditCard, Wallet } from "lucide-react";
import Header from "@/components/parking/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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

  // Get vehicle from state or callback to default
  const vehicle = location.state?.vehicle || {
    name: "Toyota Camry",
    plateNumber: "MH 12 AB 1234",
    owner: "John Doe"
  };

  return (
    <div className="min-h-screen bg-background pb-6">
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
              <span className="font-medium text-foreground">{vehicle.owner || "John Doe"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle</span>
              <span className="font-medium text-foreground">{vehicle.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number Plate</span>
              <span className="font-medium text-foreground">{vehicle.plateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mobile</span>
              <span className="font-medium text-foreground">+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parking Location Card */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Parking Location</span>
          </div>

          <h3 className="font-semibold text-foreground text-lg">Inorbit Mall</h3>
          <p className="text-sm text-muted-foreground">Malad West, Mumbai</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-4 mt-6">
        <h3 className="font-semibold text-foreground mb-2">Payment Method</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how you want to pay
        </p>

        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`p-4 rounded-2xl border-2 transition-all ${selectedPayment === method.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
                }`}
            >
              <div className={`w-10 h-10 rounded-xl ${method.color} flex items-center justify-center mb-2 mx-auto`}>
                <method.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-foreground text-center">
                {method.label}
              </p>
              {selectedPayment === method.id && (
                <div className="w-5 h-5 rounded-full bg-primary mx-auto mt-2 flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="px-4 mt-8">
        <Button
          onClick={() => navigate("/ticket", { state: { vehicle } })}
          className="w-full gradient-primary text-primary-foreground hover:opacity-90"
          size="lg"
        >
          Confirm & Pay ₹150
        </Button>
      </div>
    </div>
  );
};

export default ConfirmParking;