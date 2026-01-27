import { useState, useEffect } from "react";
import { User, Car, Bell, Shield, HelpCircle, LogOut, ChevronRight, Palette, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const settingsItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Car, label: "My Vehicles", path: "/vehicles" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Shield, label: "Privacy & Security", path: "/privacy" },
  { icon: HelpCircle, label: "Help & Support", path: "/help" },
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
      localStorage.removeItem("pixel-park-demo-session");
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-background pb-20 flex flex-col h-full overflow-hidden">
      {/* Creative Header */}
      <div className="gradient-header px-6 pt-12 pb-10 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/10 rounded-full -ml-12 -mb-12 blur-xl" />

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Manage Account</h1>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-0.5">Settings & Preferences</p>
          </div>
        </div>

        {/* User Card - Floating Style */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-xl flex items-center gap-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-white p-1 shadow-inner rotate-3 transition-transform hover:rotate-0">
            <div className="w-full h-full rounded-[1.2rem] bg-slate-100 flex items-center justify-center overflow-hidden">
              <User className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <h2 className="font-black text-lg text-white uppercase tracking-tighter truncate">
              {userEmail ? userEmail.split('@')[0] : "User"}
            </h2>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mt-0.5">
              +91 98765 43210
            </p>
          </div>
          <Palette className="w-5 h-5 text-white/30" onClick={() => navigate("/manager")} />
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 px-6 mt-8 overflow-y-auto space-y-4 pb-10">
        <div className="grid gap-3">
          {settingsItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-5 py-4 bg-card rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all group"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left font-black text-xs uppercase tracking-widest text-slate-600">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-primary transition-all" />
            </button>
          ))}
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => navigate("/driver")}
            className="w-full bg-slate-900 rounded-[2rem] p-5 shadow-xl flex items-center justify-between group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-white tracking-tight">Driver Console</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-50 rounded-[2rem] p-5 border border-red-100 flex items-center justify-center gap-3 hover:bg-red-100 transition-all group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-all" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-red-500">Log Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;