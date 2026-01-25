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
    <div className="w-full bg-card/80 backdrop-blur-xl border-t border-border/40 shadow-2xl">
      <div className="flex flex-col items-center pt-2">
        <div className="w-8 h-1 bg-muted rounded-full opacity-50" />
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground py-2">Quick Switch Role</p>
      </div>
      <div className="flex items-center justify-between px-6 pb-6 pt-2">
        {roles.map((role) => {
          const isActive = currentRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300 relative group ${isActive
                ? "text-primary scale-110"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-in fade-in zoom-in duration-300 role-switcher-active" />
              )}
              <role.icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
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