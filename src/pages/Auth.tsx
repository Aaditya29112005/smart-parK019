import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail, Loader2, Car, BrainCircuit, User, ArrowLeft } from "lucide-react";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (authMode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0],
                        }
                    }
                });
                if (error) throw error;
                toast.success("Account created! Check your email for verification.");
            } else if (authMode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                // Clear any old demo session
                localStorage.removeItem("pixel-park-demo-session");

                toast.success("Welcome back!");
                navigate("/");
            } else if (authMode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth`,
                });
                if (error) throw error;
                toast.success("Password reset link sent to your email!");
                setAuthMode('login');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-6 pt-safe pb-safe overflow-y-auto">
            <div className="w-full max-w-md bg-card rounded-[2.5rem] p-8 shadow-2xl border border-border/50 animate-in fade-in zoom-in duration-500 my-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
                        <BrainCircuit className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">
                        {authMode === 'signup' ? "Join the Network" : "Smart Park"}
                    </h1>
                    <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] mt-2 opacity-50">
                        {authMode === 'signup' ? "ESTABLISH PROTOCOL" :
                            authMode === 'login' ? "LOGIN TO SECURE PORT" : "RESTORE ACCESS"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    {authMode === 'signup' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Identified Passenger"
                                    required
                                    className="pl-11 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary shadow-inner"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                            {authMode === 'signup' ? "Secure Email" : "Email ID"}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="user@smartpark.sys"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-11 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary shadow-inner"
                            />
                        </div>
                    </div>

                    {authMode !== 'forgot' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    {authMode === 'signup' ? "Access Key" : "Password"}
                                </label>
                                {authMode === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => setAuthMode('forgot')}
                                        className="text-[10px] font-black uppercase text-primary tracking-tighter hover:opacity-70 transition-opacity"
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-11 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary shadow-inner"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-4 pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-15 gradient-primary text-primary-foreground font-black uppercase text-sm tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>{authMode === 'signup' ? "Register Link" : authMode === 'login' ? "Access Link" : "Send Link"}</span>
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </>
                            )}
                        </Button>

                        {authMode === 'login' && (
                            <Button
                                type="button"
                                onClick={() => {
                                    localStorage.setItem("pixel-park-demo-session", "true");
                                    toast.success("Entering Demo Mode...");
                                    navigate("/");
                                }}
                                className="w-full h-15 bg-white border-2 border-primary/20 text-primary font-black uppercase text-sm tracking-widest rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all"
                            >
                                Demo Access
                            </Button>
                        )}
                    </div>
                </form>

                <div className="mt-8 text-center">
                    {authMode === 'forgot' ? (
                        <button
                            onClick={() => setAuthMode('login')}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-opacity"
                        >
                            Back to Login
                        </button>
                    ) : (
                        <button
                            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                            className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <span className="opacity-60">
                                {authMode === 'login' ? "Sync not active?" : "Sync already active?"}
                            </span>
                            <span className="text-primary font-black">
                                {authMode === 'login' ? "Join Network" : "Restore Link"}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
