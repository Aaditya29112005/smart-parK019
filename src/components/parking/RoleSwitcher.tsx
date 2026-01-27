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
    <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] p-5 shadow-xl border border-slate-100 w-full animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex flex-col items-center mb-4">
        <p className="text-[12px] font-medium text-slate-400 uppercase tracking-wider">Login As</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {roles.map((role) => {
          const isActive = currentRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 ${isActive
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-slate-50/80 text-slate-400 hover:bg-slate-100 hover:text-slate-500"
                }`}
            >
              <role.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
              <span className={`text-[10px] font-bold ${isActive ? "text-white" : "text-slate-500"}`}>
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