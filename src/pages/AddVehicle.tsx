import { useState, useRef } from "react";
import { Camera, Car, User, Phone, FileText, CheckCircle2, ChevronRight, Loader2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/parking/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StorageService } from "@/lib/storage";
import { toast } from "sonner";

const AddVehicle = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState("");
    const [plate, setPlate] = useState("");
    const [owner, setOwner] = useState("");
    const [phone, setPhone] = useState("");
    const [type, setType] = useState<"car" | "bike">("car");

    const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVehiclePhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
            toast.success("Vehicle visual captured");
        }
    };

    const handleRegister = async () => {
        if (!model || !plate || !owner || !phone) {
            toast.error("Protocol error: Required fields missing");
            return;
        }

        setLoading(true);
        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newVehicle = StorageService.addVehicle({
                name: model,
                plateNumber: plate,
                type: type,
                ownerName: owner,
                ownerPhone: phone,
            });

            toast.success("Vehicle synced to secure network!");
            navigate("/scanner", { state: { newVehicle } });
        } catch (error) {
            toast.error("Sync failed. Check connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background pb-10 min-h-screen">
            <Header title="Add New Vehicle" showBack />

            <div className="px-6 pt-6">
                <div className="flex items-center gap-3 mb-8 bg-slate-900/5 p-4 rounded-3xl border border-slate-200">
                    <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase text-slate-800 tracking-tight">Vehicle Registration</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase opacity-60">Authorize new unit for parking access</p>
                    </div>
                </div>

                {/* Vehicle Type Selection */}
                <div className="mb-8">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Classification</Label>
                    <Tabs
                        value={type}
                        onValueChange={(v) => setType(v as "car" | "bike")}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 rounded-2xl h-14">
                            <TabsTrigger value="car" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full">Car / SUV</TabsTrigger>
                            <TabsTrigger value="bike" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full">Two-Wheeler</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Vehicle Photo */}
                <div className="mb-8">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Visual Identification *</Label>
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={photoInputRef}
                        onChange={handlePhotoChange}
                    />
                    <div className="mt-3 flex justify-center">
                        <button
                            onClick={() => photoInputRef.current?.click()}
                            className="w-full h-44 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all bg-white shadow-sm overflow-hidden relative group"
                        >
                            {photoPreview ? (
                                <>
                                    <img src={photoPreview} alt="Vehicle Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                        <Camera className="w-6 h-6 opacity-40" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Capture / Upload Vehicle Visual</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="mb-10 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-4 bg-primary rounded-full" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Unit Credentials</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="model" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Model *</Label>
                            <div className="relative">
                                <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="model"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    placeholder="Manufacturer & Model"
                                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plate" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registration Plate *</Label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="plate"
                                    value={plate}
                                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                    placeholder="XX 00 XX 0000"
                                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-sm font-medium uppercase"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="owner" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Proprietor Name *</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="owner"
                                        value={owner}
                                        onChange={(e) => setOwner(e.target.value)}
                                        placeholder="Full Name"
                                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Link *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 00000 00000"
                                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full h-16 rounded-2xl gradient-primary text-white font-black uppercase text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>Register Unit</span>
                            <CheckCircle2 className="w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default AddVehicle;

