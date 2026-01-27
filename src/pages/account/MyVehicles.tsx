import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Search, Plus, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const MyVehicles = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [vehicles, setVehicles] = useState([
        { id: 1, model: "Tesla Model 3", plate: "MH 01 AB 1234", color: "Pearl White" },
        { id: 2, model: "Range Rover Sport", plate: "MH 04 XY 5678", color: "Santorini Black" },
    ]);

    const filteredVehicles = vehicles.filter(v =>
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deleteVehicle = (id: number) => {
        setVehicles(vehicles.filter(v => v.id !== id));
        toast.success("Vehicle removed");
    };

    return (
        <div className="h-full bg-background flex flex-col">
            <div className="px-6 pt-12 pb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate("/settings")}
                    className="p-2 bg-white rounded-xl shadow-sm border border-border hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">My Vehicles</h1>
            </div>

            {/* Search Bar */}
            <div className="px-6 mb-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search your cars..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 bg-card border-none shadow-sm rounded-2xl focus-visible:ring-primary/20"
                    />
                </div>
            </div>

            {/* Vehicles List */}
            <div className="flex-1 px-6 space-y-4 overflow-y-auto pb-24">
                {filteredVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-card p-5 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Car className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{vehicle.model}</h3>
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mt-0.5">{vehicle.plate}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteVehicle(vehicle.id)}
                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-4 pt-4 border-t border-dashed border-border flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Color</span>
                            <span className="text-xs font-bold text-slate-600">{vehicle.color}</span>
                        </div>
                    </div>
                ))}

                {filteredVehicles.length === 0 && (
                    <div className="py-10 text-center">
                        <p className="text-slate-400 font-medium italic">No vehicles found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {/* Add Vehicle FAB */}
            <div className="absolute bottom-8 right-6">
                <Button
                    onClick={() => navigate("/add-vehicle")}
                    className="w-14 h-14 rounded-2xl gradient-primary shadow-xl shadow-primary/30 flex items-center justify-center p-0 group"
                >
                    <Plus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                </Button>
            </div>
        </div>
    );
};

export default MyVehicles;
