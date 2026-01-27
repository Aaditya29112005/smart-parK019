import { useState, useEffect } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Navigation } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { Button } from "@/components/ui/button";

// Placeholder token - User should provide their own for production
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTVoZG9rdm0wY2RsMmpxeHh4bm8zZzR4In0.1x3YF7_H-XQ9j7m5x-x6pA"; // Lovable default or user token

const LiveMap = () => {
    const { latitude, longitude, error, loading } = useLocation();
    const [viewport, setViewport] = useState({
        latitude: 19.0760, // Default to Mumbai
        longitude: 72.8777,
        zoom: 14,
    });

    useEffect(() => {
        if (latitude && longitude) {
            setViewport({
                latitude,
                longitude,
                zoom: 15,
            });
        }
    }, [latitude, longitude]);

    if (loading) {
        return (
            <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-[2rem]">
                <div className="flex flex-col items-center gap-2">
                    <Navigation className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Locating...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-[2rem] p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                        Location Access Denied.<br />Please enable GPS.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden border border-border/50 shadow-card">
            <Map
                {...viewport}
                onMove={(evt) => setViewport(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
            >
                {latitude && longitude && (
                    <Marker latitude={latitude} longitude={longitude} anchor="bottom">
                        <div className="relative">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center animate-ping absolute -top-1 -left-1" />
                            <div className="w-8 h-8 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-primary relative z-10 transition-transform hover:scale-110">
                                <Navigation className="w-4 h-4 text-primary fill-primary" />
                            </div>
                        </div>
                    </Marker>
                )}
                <div className="absolute top-4 right-4">
                    <NavigationControl showCompass={false} />
                </div>

                {/* Recenter Button */}
                <Button
                    className="absolute bottom-6 right-6 w-12 h-12 rounded-2xl gradient-primary shadow-lg shadow-primary/30 flex items-center justify-center"
                    onClick={() => {
                        if (latitude && longitude) {
                            setViewport({
                                latitude,
                                longitude,
                                zoom: 15,
                            });
                        }
                    }}
                >
                    <Navigation className="w-5 h-5 text-white" />
                </Button>
            </Map>
        </div>
    );
};

export default LiveMap;
