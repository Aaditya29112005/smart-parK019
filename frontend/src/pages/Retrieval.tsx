import { useState, useEffect } from "react";
import { Check, Clock, Car as CarIcon, Navigation } from "lucide-react";
import Header from "@/components/parking/Header";
import ProgressStep from "@/components/parking/ProgressStep";
import { useLocation, useNavigate } from "react-router-dom";
import { StorageService, ParkingSession } from "@/lib/storage";

const Retrieval = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<ParkingSession | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const s = location.state?.session || StorageService.getActiveSession();
    if (s) {
      setSession(s);
    }
  }, [location.state]);

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 2) return prev + 1;
        clearInterval(timer);
        setTimeout(() => navigate("/task-completed"), 1500);
        return prev;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [navigate]);

  const steps = [
    {
      icon: Check,
      title: "Request Received",
      subtitle: "Valet has been notified",
    },
    {
      icon: CarIcon,
      title: "Car on the Way",
      subtitle: "Vehicle is being brought",
    },
    {
      icon: Navigation,
      title: "Car Arriving",
      subtitle: "Ready for pickup",
    },
  ];

  if (!session) return null;

  return (
    <div className="bg-background">
      <Header title="Vehicle Retrieval" showBack />

      {/* Status Card */}
      <div className="px-4 mt-4">
        <div className="gradient-success rounded-2xl p-5 text-success-foreground">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">{steps[currentStep].title}</h3>
              <p className="text-sm opacity-90">{steps[currentStep].subtitle}</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-full px-4 py-2 flex items-center gap-2 w-fit">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {currentStep === 2 ? "Ready for pickup" : "Estimated: 2-3 mins"}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="px-4 mt-6">
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-6">Retrieval Progress</h3>

          <div className="space-y-0">
            {steps.map((step, index) => (
              <ProgressStep
                key={index}
                icon={step.icon}
                title={step.title}
                subtitle={step.subtitle}
                isCompleted={index < currentStep}
                isActive={index === currentStep}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Parking Details */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Parking Details</h3>

          <div className="flex items-center gap-3">
            <CarIcon className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Vehicle</p>
              <p className="font-semibold text-foreground">{session.vehicleName}</p>
              <p className="text-sm text-muted-foreground">{session.plateNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Retrieval;