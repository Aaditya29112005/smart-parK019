import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  variant?: "default" | "gradient";
}

const Header = ({ title, showBack = false, rightAction, variant = "gradient" }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header
      className={`px-4 pt-8 pb-4 ${variant === "gradient"
        ? "gradient-header text-primary-foreground"
        : "bg-card text-foreground border-b border-border"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1 -ml-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};

export default Header;