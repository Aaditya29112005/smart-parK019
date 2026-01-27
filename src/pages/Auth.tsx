import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail, Loader2, Car } from "lucide-react";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Demo Bypass
        if (!isSignUp && email === "demo@pixelpark.com" && password === "password123") {
            localStorage.setItem("pixel-park-demo-session", "true");
            toast.success("Welcome (Demo Mode)!");
            navigate("/");
            setLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                toast.success("Check your email for confirmation!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success("Welcome back!");
                navigate("/");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-6 pt-safe pb-safe overflow-y-auto">
            <div className="w-full max-w-md bg-card rounded-[2.5rem] p-8 shadow-2xl border border-border/50 animate-in fade-in zoom-in duration-500 my-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
                        <Car className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">Smart Park</h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        {isSignUp ? "Create your account" : "Login to your account"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email ID</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-11 h-13 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-11 h-13 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary shadow-inner"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 gradient-primary text-primary-foreground font-black uppercase text-sm tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        {isSignUp ? "Join Now" : "Login Now"}
                    </Button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-border/50" />
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">or continue with</span>
                    <div className="flex-1 h-px bg-border/50" />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                    <button
                        type="button"
                        onClick={() => toast.info("Google Login is coming soon!")}
                        className="w-full h-12 rounded-2xl border border-border bg-white flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600">Google Login</span>
                    </button>

                    <button
                        onClick={() => {
                            setEmail("demo@pixelpark.com");
                            setPassword("password123");
                            setIsSignUp(false);
                            toast.info("Demo credentials filled!");
                        }}
                        className="w-full h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
                    >
                        Demo Access
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-opacity"
                    >
                        {isSignUp ? "Already a member? Login" : "Don't have an account? Join Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}
