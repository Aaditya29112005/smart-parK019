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
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-card border-t border-border shadow-lg z-50">
      <p className="text-center text-xs text-muted-foreground pt-2">Login As</p>
      <div className="flex items-center justify-center gap-2 p-3">
        {roles.map((role) => {
          const isActive = currentRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <role.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{role.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSwitcher;