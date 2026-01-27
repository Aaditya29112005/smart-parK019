import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, HelpCircle, MessageSquare, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

const HelpSupport = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full bg-background flex flex-col">
            <div className="px-6 pt-12 pb-6 flex items-center gap-4">
                <button onClick={() => navigate("/settings")} className="p-2 bg-white rounded-xl shadow-sm border"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-xl font-bold">Help & Support</h1>
            </div>

            <div className="px-6 mb-8 text-center bg-primary/5 py-10 rounded-[2.5rem] mx-6">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-4">
                    <HelpCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-2">How can we help?</h2>
                <div className="relative mt-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search FAQs..." className="pl-11 h-12 rounded-2xl bg-white border-none shadow-sm" />
                </div>
            </div>

            <div className="flex-1 px-6 space-y-4 overflow-y-auto pb-10">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Quick Contact</h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: MessageSquare, label: "Chat" },
                        { icon: Mail, label: "Email" },
                        { icon: Phone, label: "Call" },
                    ].map(c => (
                        <button key={c.label} className="bg-card p-4 rounded-3xl border border-border/50 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all">
                            <c.icon className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{c.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
