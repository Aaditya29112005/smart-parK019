import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "+91 98765 43210",
        address: "Mumbai, Maharashtra, India"
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setProfile(prev => ({
                    ...prev,
                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
                    email: user.email || "",
                }));
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: profile.name }
            });
            if (error) throw error;
            setIsEditing(false);
            toast.success("Profile updated in Supabase!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="h-full bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full bg-background flex flex-col">
            {/* Creative Header */}
            <div className="relative h-48 bg-primary/20 overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-80" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

                <div className="relative z-10 px-6 pt-12 flex items-center justify-between text-white">
                    <button
                        onClick={() => navigate("/settings")}
                        className="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-black uppercase tracking-widest">My Profile</h1>
                    <div className="w-9" /> {/* Spacer */}
                </div>

                {/* Profile Picture Placeholder */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                            <div className="w-full h-full rounded-[2.2rem] bg-slate-100 flex items-center justify-center overflow-hidden">
                                <User className="w-12 h-12 text-slate-300" />
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg active:scale-95 transition-all">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Space */}
            <div className="flex-1 px-6 pt-20 pb-10 space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-black uppercase text-slate-400 tracking-tighter">Information</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="text-primary font-bold text-xs uppercase"
                    >
                        {isEditing ? (
                            <span className="flex items-center gap-1 group">
                                <Check className="w-3 h-3 group-hover:scale-125 transition-transform" /> Save
                            </span>
                        ) : "Edit"}
                    </Button>
                </div>

                {/* Fields List */}
                <div className="space-y-4">
                    <div className="bg-card/50 backdrop-blur-sm p-4 rounded-3xl border border-border/50 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 mb-1">
                            <User className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</span>
                        </div>
                        {isEditing ? (
                            <Input
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="bg-transparent border-none p-0 focus-visible:ring-0 text-foreground font-bold h-auto"
                            />
                        ) : (
                            <p className="font-bold text-foreground pl-8">{profile.name}</p>
                        )}
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm p-4 rounded-3xl border border-border/50 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 mb-1">
                            <Mail className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</span>
                        </div>
                        {isEditing ? (
                            <Input
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="bg-transparent border-none p-0 focus-visible:ring-0 text-foreground font-bold h-auto"
                            />
                        ) : (
                            <p className="font-bold text-foreground pl-8">{profile.email}</p>
                        )}
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm p-4 rounded-3xl border border-border/50 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 mb-1">
                            <Phone className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number</span>
                        </div>
                        <p className="font-bold text-foreground pl-8">{profile.phone}</p>
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm p-4 rounded-3xl border border-border/50 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 mb-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Address</span>
                        </div>
                        {isEditing ? (
                            <textarea
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-foreground font-bold resize-none h-16 text-sm"
                            />
                        ) : (
                            <p className="font-bold text-foreground pl-8 text-sm">{profile.address}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
