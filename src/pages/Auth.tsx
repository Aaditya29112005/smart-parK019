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
        <div className="min-h-full bg-slate-900 flex flex-col items-center justify-center p-6 pt-safe pb-safe">
            <div className="w-full max-w-md bg-card rounded-[2.5rem] p-8 shadow-2xl border border-border/50 animate-in fade-in zoom-in duration-500 my-auto">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <Car className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">Smart Park</h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        {isSignUp ? "Create your account" : "Welcome back"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-12 h-14 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-12 h-14 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary shadow-inner"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 gradient-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <button
                        onClick={() => {
                            setEmail("demo@pixelpark.com");
                            setPassword("password123");
                            setIsSignUp(false);
                            toast.info("Example credentials filled!");
                        }}
                        className="w-full h-12 rounded-xl bg-accent/30 text-accent-foreground font-bold text-xs uppercase tracking-widest hover:bg-accent/50 transition-all border border-accent/20"
                    >
                        Use Demo Account
                    </button>

                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm font-bold text-primary hover:opacity-70 transition-opacity"
                    >
                        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
