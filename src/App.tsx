import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import MapExplorer from "./pages/MapExplorer";
import NotFound from "./pages/NotFound";
import AddVehicle from "./pages/AddVehicle";
import RoleSwitcher from "./components/parking/RoleSwitcher";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Account Pages
import Profile from "./pages/account/Profile";
import MyVehicles from "./pages/account/MyVehicles";
import Notifications from "./pages/account/Notifications";
import PrivacySecurity from "./pages/account/PrivacySecurity";
import HelpSupport from "./pages/account/HelpSupport";

import BottomNav from "./components/parking/BottomNav";
import AIChatbot from "./components/parking/AIChatbot";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (e) {
        console.warn("Supabase connection failed - staying in offline/demo mode");
      }
    };

    fetchSession();
    setIsDemo(localStorage.getItem("pixel-park-demo-session") === "true");

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsDemo(localStorage.getItem("pixel-park-demo-session") === "true");
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!session || isDemo;
  const isAuthPage = location.pathname === "/auth";

  // Pages that shouldn't show the role switcher
  const hideRoleSwitcher = isAuthPage || !isAuthenticated || [
    "/scanner",
    "/confirm-parking",
    "/task-completed",
    "/add-driver",
    "/add-vehicle"
  ].includes(location.pathname);

  const showBottomNav = isAuthenticated && [
    "/",
    "/history",
    "/settings",
    "/ticket"
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 gap-8">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen relative">
          <div className={`phone-content ${(showBottomNav || !hideRoleSwitcher) ? 'pb-20' : ''}`}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="*"
                element={
                  !isAuthenticated && location.pathname === "/" ? (
                    <Navigate to="/auth" replace />
                  ) : (
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
                        <Route path="/map" element={<MapExplorer />} />

                        {/* Account Routes */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/vehicles" element={<MyVehicles />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/privacy" element={<PrivacySecurity />} />
                        <Route path="/help" element={<HelpSupport />} />

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ProtectedRoute>
                  )
                }
              />
            </Routes>
          </div>

          <AIChatbot />

          {/* Native Bottom Navigation - inside phone-screen */}
          {showBottomNav && (
            <div className="absolute bottom-0 left-0 w-full z-50">
              <BottomNav />
            </div>
          )}
        </div>
      </div>

      {/* Role Switcher - below phone frame */}
      {!hideRoleSwitcher && (
        <div className="w-full max-w-[420px] pb-4">
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