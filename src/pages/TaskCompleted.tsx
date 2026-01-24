import { useEffect } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TaskCompleted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 2500);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-16 h-16 bg-success/30 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-success" strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Task Completed!</h1>
        <p className="text-muted-foreground">Vehicle retrieved successfully</p>
      </div>
    </div>
  );
};

export default TaskCompleted;