import { useState } from "react";
import { Camera, Car, User, Phone, FileText } from "lucide-react";
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
    const [model, setModel] = useState("");
    const [plate, setPlate] = useState("");
    const [owner, setOwner] = useState("");
    const [phone, setPhone] = useState("");
    const [type, setType] = useState<"car" | "bike">("car");

    const handleRegister = () => {
        if (!model || !plate || !owner || !phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        const newVehicle = StorageService.addVehicle({
            name: model,
            plateNumber: plate,
            type: type,
            ownerName: owner,
            ownerPhone: phone,
        });

        toast.success("Vehicle registered successfully!");
        navigate("/scanner", { state: { newVehicle } });
    };

    return (
        <div className="min-h-screen bg-background pb-6">
            <Header title="Add New Vehicle" showBack />

            <div className="px-4 pt-4">
                <p className="text-muted-foreground mb-6">
                    Register a new vehicle for parking
                </p>

                {/* Vehicle Type Selection */}
                <div className="mb-6">
                    <Label className="text-foreground mb-2 block">Vehicle Type</Label>
                    <Tabs
                        value={type}
                        onValueChange={(v) => setType(v as "car" | "bike")}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="car">Car</TabsTrigger>
                            <TabsTrigger value="bike">Bike</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Vehicle Photo */}
                <div className="mb-6">
                    <Label className="text-foreground">Vehicle Photo *</Label>
                    <div className="mt-2 flex justify-center">
                        <button className="w-full h-40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-muted/30">
                            <Camera className="w-8 h-8 mb-2" />
                            <span className="text-sm">Take / Upload Photo</span>
                        </button>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-4">Vehicle Details</h3>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="model">Vehicle Model *</Label>
                            <div className="relative mt-1">
                                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="model"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    placeholder="e.g. Toyota Camry"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="plate">License Plate Number *</Label>
                            <div className="relative mt-1">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="plate"
                                    value={plate}
                                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                    placeholder="MH 12 AB 1234"
                                    className="pl-10 uppercase"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="owner">Owner Name *</Label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="owner"
                                    value={owner}
                                    onChange={(e) => setOwner(e.target.value)}
                                    placeholder="Enter owner name"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="phone">Owner Phone *</Label>
                            <div className="relative mt-1">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleRegister}
                    className="w-full gradient-primary text-primary-foreground hover:opacity-90"
                    size="lg"
                >
                    Register Vehicle
                </Button>
            </div>
        </div>
    );
};

export default AddVehicle;

