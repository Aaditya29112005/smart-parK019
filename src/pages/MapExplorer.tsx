import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, Layers, Loader2 } from "lucide-react";
import LiveMap, { LiveMapRef } from "@/components/parking/LiveMap";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

const MapExplorer = () => {
    const navigate = useNavigate();
    const mapRef = useRef<LiveMapRef>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchNearMe = () => {
        setIsSearching(true);
        mapRef.current?.recenter();

        // Mock searching animation
        setTimeout(() => {
            setIsSearching(false);
        }, 2000);
    };

    return (
        <div className="h-full w-full bg-background flex flex-col relative overflow-hidden">
            {/* Full Screen Map Container */}
            <div className="absolute inset-0 z-0 text-white">
                <LiveMap ref={mapRef} hideSearch={true} hideRecenter={true} />
            </div>

            {/* Top Bar - Header Area */}
            <div className="relative z-10 px-6 pt-12 pointer-events-none">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => navigate("/")}
                        className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center justify-center text-slate-600 hover:text-primary active:scale-95 transition-all pointer-events-auto"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>

                    <div className="flex-1 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl px-4 py-3 flex items-center gap-3 pointer-events-auto">
                        <Search className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-500 uppercase tracking-tight">Search parking near...</span>
                    </div>
                </div>
            </div>

            {/* Bottom Floating Controls */}
            <div className="absolute bottom-28 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
                <div className="flex flex-col gap-3 pointer-events-auto">
                    <Button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center justify-center text-slate-600 hover:text-primary active:scale-95 transition-all">
                        <Layers className="w-5 h-5" />
                    </Button>
                    <Button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center justify-center text-slate-600 hover:text-primary active:scale-95 transition-all">
                        <Filter className="w-5 h-5" />
                    </Button>
                </div>

                {/* Search Near Me FAB - Mobile Style */}
                <div
                    onClick={handleSearchNearMe}
                    className={`px-6 h-14 rounded-[2rem] shadow-2xl flex items-center gap-2 pointer-events-auto cursor-pointer transition-all active:scale-95 ${isSearching
                            ? 'bg-purple-600 ring-4 ring-purple-500/20'
                            : 'bg-primary hover:bg-primary/90 shadow-primary/30'
                        }`}
                >
                    {isSearching ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                        <Search className="w-5 h-5 text-white" />
                    )}
                    <span className="text-white text-xs font-black uppercase tracking-widest">
                        {isSearching ? 'Searching...' : 'Search Near Me'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MapExplorer;
