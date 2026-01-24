import { Camera, User, Phone, Mail, MapPin, Calendar, FileText, Upload } from "lucide-react";
import Header from "@/components/parking/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddDriver = () => {
  return (
    <div className="min-h-screen bg-background pb-6">
      <Header title="Add Driver/Valet" showBack />

      <div className="px-4 pt-4">
        <p className="text-muted-foreground mb-6">
          Fill in the details to add a new driver
        </p>

        {/* Driver Photo */}
        <div className="mb-6">
          <Label className="text-foreground">Driver Photo *</Label>
          <div className="mt-2 flex justify-center">
            <button className="w-28 h-28 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <Camera className="w-8 h-8 mb-1" />
              <span className="text-xs">Take Photo</span>
            </button>
          </div>
        </div>

        {/* Personal Details */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-4">Personal Details</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="fullName" placeholder="Enter full name" className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="phone" placeholder="+91 98765 43210" className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" placeholder="driver@example.com" className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="address" placeholder="Enter address" className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="dob" placeholder="dd/mm/yyyy" className="pl-10" />
              </div>
            </div>
          </div>
        </div>

        {/* License Details */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-4">License Details</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="license">Driving License Number *</Label>
              <div className="relative mt-1">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="license" placeholder="DL-1420110012345" className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="licenseExpiry">License Expiry Date</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="licenseExpiry" placeholder="dd/mm/yyyy" className="pl-10" />
              </div>
            </div>

            <div>
              <Label>License Photo *</Label>
              <button className="mt-2 w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-muted/30">
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm">Upload License Photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          className="w-full gradient-primary text-primary-foreground hover:opacity-90"
          size="lg"
        >
          Submit for Approval
        </Button>
      </div>
    </div>
  );
};

export default AddDriver;