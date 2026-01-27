import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Fingerprint } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const PrivacySecurity = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full bg-background flex flex-col">
            <div className="px-6 pt-12 pb-6 flex items-center gap-4">
                <button onClick={() => navigate("/settings")} className="p-2 bg-white rounded-xl shadow-sm border"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-xl font-bold">Privacy & Security</h1>
            </div>

            <div className="flex-1 px-6 space-y-6 overflow-y-auto">
                <section>
                    <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 ml-1">Settings</h2>
                    <div className="space-y-3">
                        {[
                            { icon: Fingerprint, label: "Biometric Login", status: true },
                            { icon: Lock, label: "Two-Factor Auth", status: false },
                            { icon: Eye, label: "Hide License Plate", status: false },
                        ].map(s => (
                            <div key={s.label} className="bg-card p-4 rounded-3xl border border-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600"><s.icon className="w-4 h-4" /></div>
                                    <span className="font-bold text-sm">{s.label}</span>
                                </div>
                                <Switch checked={s.status} />
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 ml-1">Data</h2>
                    <button className="w-full bg-card p-4 rounded-3xl border border-border/50 text-left font-bold text-sm hover:bg-slate-50 transition-colors">
                        Download My Data
                    </button>
                </section>
            </div>
        </div>
    );
};

export default PrivacySecurity;
