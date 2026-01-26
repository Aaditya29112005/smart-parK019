import { User, ShieldCheck, Car, Crown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type Role = "user" | "manager" | "driver" | "admin";

const roles = [
  { id: "user" as Role, label: "User", icon: User, path: "/" },
  { id: "manager" as Role, label: "Manager", icon: ShieldCheck, path: "/manager" },
  { id: "driver" as Role, label: "Driver", icon: Car, path: "/driver" },
  { id: "admin" as Role, label: "Super Admin", icon: Crown, path: "/admin" },
];

const RoleSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentRole = (): Role => {
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/driver")) return "driver";
    if (location.pathname.startsWith("/manager")) return "manager";
    return "user";
  };

  const currentRole = getCurrentRole();

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-2xl border border-white/20 w-full max-w-[420px] animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex flex-col items-center mb-6">
        <p className="text-sm font-semibold text-slate-500">Login As</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {roles.map((role) => {
          const isActive = currentRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 relative group ${isActive
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                }`}
            >
              <role.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
              <span className="text-[10px] font-bold">
                {role.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSwitcher;