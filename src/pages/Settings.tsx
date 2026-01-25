import { useState, useEffect } from "react";
import { User, Car, Bell, Shield, HelpCircle, LogOut, ChevronRight, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/parking/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const settingsItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Car, label: "My Vehicles", path: "/vehicles" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Shield, label: "Privacy & Security", path: "/privacy" },
  { icon: HelpCircle, label: "Help & Support", path: "/help" },
  { icon: Palette, label: "Manager Dashboard", path: "/manager" },
];

const Settings = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email ?? null);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="gradient-header px-4 py-6 rounded-b-3xl">
        <h1 className="text-xl font-bold text-primary-foreground">Settings</h1>
        <p className="text-primary-foreground/70 text-sm mt-1">Manage your account</p>
      </div>

      {/* User Card */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-foreground truncate max-w-[200px]">
              {userEmail ? userEmail.split('@')[0] : "User"}
            </h2>
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {userEmail ?? "+91 98765 43210"}
            </p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-4 mt-6">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {settingsItems.map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors ${index !== settingsItems.length - 1 ? "border-b border-border" : ""
                }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Driver Console Link */}
      <div className="px-4 mt-4">
        <button
          onClick={() => navigate("/driver")}
          className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
            <Car className="w-5 h-5 text-success" />
          </div>
          <span className="flex-1 text-left font-medium text-foreground">
            Driver Console
          </span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Logout */}
      <div className="px-4 mt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 hover:bg-destructive/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <span className="flex-1 text-left font-medium text-destructive">
            Log Out
          </span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;