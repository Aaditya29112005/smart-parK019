import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            // Check for demo session first
            const isDemo = localStorage.getItem("pixel-park-demo-session") === "true";
            if (isDemo) {
                setAuthenticated(true);
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setAuthenticated(true);
            } else {
                navigate("/auth");
            }
            setLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setAuthenticated(true);
            } else {
                // Only redirect if not in demo mode
                const isDemo = localStorage.getItem("pixel-park-demo-session") === "true";
                if (!isDemo) {
                    setAuthenticated(false);
                    navigate("/auth");
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return authenticated ? <>{children}</> : null;
};
