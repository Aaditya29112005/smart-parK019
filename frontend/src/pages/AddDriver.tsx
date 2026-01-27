import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, User, Phone, Mail, MapPin, Calendar, FileText, Upload, CheckCircle2, Loader2 } from "lucide-react";
import Header from "@/components/parking/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StorageService } from "@/lib/storage";

const AddDriver = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  const [driverPhoto, setDriverPhoto] = useState<File | null>(null);
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);
  const [driverPhotoPreview, setDriverPhotoPreview] = useState<string | null>(null);
  const [licensePhotoPreview, setLicensePhotoPreview] = useState<string | null>(null);

  const driverPhotoInputRef = useRef<HTMLInputElement>(null);
  const licensePhotoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'driver' | 'license') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'driver') {
        setDriverPhoto(file);
        setDriverPhotoPreview(previewUrl);
      } else {
        setLicensePhoto(file);
        setLicensePhotoPreview(previewUrl);
      }
      toast.success(`${type === 'driver' ? 'Profile' : 'License'} photo selected`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.licenseNumber || !licensePhoto) {
      toast.error("Please fill required fields and upload license");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const demoSession = localStorage.getItem("pixel-park-demo-session");

      if (!user && !demoSession) {
        toast.error("Please login to submit details");
        return;
      }

      // Real persistence to StorageService
      await StorageService.addDriver({
        fullName: formData.fullName,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        avatarUrl: driverPhotoPreview || undefined
      });

      toast.success("Identity synchronized to secure ledger!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Transmission failed. Retry protocol."); // Updated error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background pb-10 min-h-screen">
      <Header title="Add Driver/Valet" showBack />

      <form onSubmit={handleSubmit} className="px-6 pt-6">
        <div className="flex items-center gap-3 mb-8 bg-primary/5 p-4 rounded-3xl border border-primary/10">
          <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase text-slate-800 tracking-tight">Onboarding Protocol</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase opacity-60">Register official driver credentials</p>
          </div>
        </div>

        {/* Driver Photo */}
        <div className="mb-8">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Profile Visual Identification *</Label>
          <div className="mt-4 flex justify-center">
            <input
              type="file"
              accept="image/*"
              hidden
              ref={driverPhotoInputRef}
              onChange={(e) => handleFileChange(e, 'driver')}
            />
            <button
              type="button"
              onClick={() => driverPhotoInputRef.current?.click()}
              className="w-32 h-32 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all bg-white shadow-sm relative overflow-hidden group"
            >
              {driverPhotoPreview ? (
                <>
                  <img src={driverPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <Camera className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Capture Photo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Personal Details */}
        <div className="mb-8 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Entity Details</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Designation *</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name as per Government ID"
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Comms Link *</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 00000 00000"
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Digital Protocol</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="driver@domain.sys"
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Base Location</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full Residential Address"
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* License Details */}
        <div className="mb-10 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-4 bg-green-500 rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Legal Authorization</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">License Serial *</Label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="DL-XXXXXXXXXXXXX"
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">License Documentation *</Label>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={licensePhotoInputRef}
                onChange={(e) => handleFileChange(e, 'license')}
              />
              <button
                type="button"
                onClick={() => licensePhotoInputRef.current?.click()}
                className="mt-2 w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all bg-white shadow-sm overflow-hidden group relative"
              >
                {licensePhotoPreview ? (
                  <>
                    <img src={licensePhotoPreview} alt="License Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5 opacity-40" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Upload Driving License (Front/Back)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-16 rounded-2xl gradient-primary text-white font-black uppercase text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-6"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Transmit for Approval</span>
              <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </Button>

        <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest opacity-60">
          By submitting, you agree to the Smart Park driver verification protocol.
        </p>
      </form>
    </div>
  );
};

export default AddDriver;