import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import ConfirmParking from "./pages/ConfirmParking";
import Ticket from "./pages/Ticket";
import Retrieval from "./pages/Retrieval";
import History from "./pages/History";
import Settings from "./pages/Settings";
import ManagerDashboard from "./pages/ManagerDashboard";
import AddDriver from "./pages/AddDriver";
import DriverConsole from "./pages/DriverConsole";
import TaskCompleted from "./pages/TaskCompleted";
import SuperAdmin from "./pages/SuperAdmin";
import NotFound from "./pages/NotFound";
import AddVehicle from "./pages/AddVehicle";
import RoleSwitcher from "./components/parking/RoleSwitcher";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import BottomNav from "./components/parking/BottomNav";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  // Pages that shouldn't show the role switcher
  const hideRoleSwitcher = [
    "/auth",
    "/scanner",
    "/confirm-parking",
    "/task-completed",
    "/add-driver",
    "/add-vehicle"
  ].includes(location.pathname);

  const showBottomNav = [
    "/",
    "/history",
    "/settings",
    "/ticket"
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen relative">
          <div className={`phone-content ${(showBottomNav || !hideRoleSwitcher) ? 'pb-60' : ''}`}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/scanner" element={<Scanner />} />
                      <Route path="/confirm-parking" element={<ConfirmParking />} />
                      <Route path="/ticket" element={<Ticket />} />
                      <Route path="/retrieval" element={<Retrieval />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/manager" element={<ManagerDashboard />} />
                      <Route path="/add-driver" element={<AddDriver />} />
                      <Route path="/add-vehicle" element={<AddVehicle />} />
                      <Route path="/driver" element={<DriverConsole />} />
                      <Route path="/task-completed" element={<TaskCompleted />} />
                      <Route path="/admin" element={<SuperAdmin />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>

          {/* Native Bottom Navigation - inside phone-screen */}
          {showBottomNav && (
            <div className="absolute bottom-0 left-0 w-full z-50">
              <BottomNav />
            </div>
          )}
        </div>
      </div>

      {/* Role Switcher - outside phone frame */}
      {!hideRoleSwitcher && (
        <div className="w-full flex justify-center">
          <RoleSwitcher />
        </div>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;