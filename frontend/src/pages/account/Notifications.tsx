import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Filter, CheckCheck } from "lucide-react";

const Notifications = () => {
    const navigate = useNavigate();
    const notifications = [
        { id: 1, title: "Parking Session Started", body: "Your session at Phoenix Mall has started.", time: "2 mins ago", type: "info" },
        { id: 2, title: "Payment Success", body: "Payment of ₹150 processed successfully.", time: "1 hour ago", type: "success" },
        { id: 3, title: "Account Security", body: "A new login was detected from Mumbai.", time: "Yesterday", type: "warning" },
    ];

    return (
        <div className="h-full bg-background flex flex-col">
            <div className="px-6 pt-12 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/settings")} className="p-2 bg-white rounded-xl shadow-sm border"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-xl font-bold">Notifications</h1>
                </div>
                <button className="p-2 text-primary"><CheckCheck className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 px-6 space-y-4 overflow-y-auto">
                <div className="flex gap-2 mb-4">
                    {["All", "Parking", "Security"].map(f => (
                        <button key={f} className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${f === 'All' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                {notifications.map(n => (
                    <div key={n.id} className="bg-card p-4 rounded-3xl border border-border/50 flex gap-4 transition-all hover:bg-slate-50">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            <Bell className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                                <h3 className="font-bold text-sm">{n.title}</h3>
                                <span className="text-[10px] font-medium text-slate-400">{n.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{n.body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
