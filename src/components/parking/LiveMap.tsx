import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Search, X } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { renderToStaticMarkup } from "react-dom/server";

// Placeholder token - User should provide their own for production
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTVoZG9rdm0wY2RsMmpxeHh4bm8zZzR4In0.1x3YF7_H-XQ9j7m5x-x6pA";

// Map Component that handles view updates
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
};

// Custom Marker Icons using DivIcon for premium feel
const createCustomIcon = (type: 'live' | 'search') => {
    const iconMarkup = renderToStaticMarkup(
        type === 'live' ? (
            <div className="relative">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center animate-ping absolute -top-1 -left-1" />
                <div className="w-8 h-8 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-primary relative z-10">
                    <Navigation className="w-4 h-4 text-primary fill-primary" />
                </div>
            </div>
        ) : (
            <div className="relative animate-bounce">
                <div className="w-12 h-12 bg-white rounded-[1.25rem] shadow-2xl flex items-center justify-center border-2 border-green-500 relative z-10">
                    <MapPin className="w-6 h-6 text-green-500 fill-green-50" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 blur-sm rounded-full" />
            </div>
        )
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-leaflet-icon',
        iconSize: type === 'live' ? [32, 32] : [48, 48],
        iconAnchor: type === 'live' ? [16, 16] : [24, 48],
    });
};

interface LiveMapProps {
    hideSearch?: boolean;
}

const LiveMap = ({ hideSearch = false }: LiveMapProps) => {
    const { latitude: liveLat, longitude: liveLng, error, loading } = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ lat: number; lng: number; name: string } | null>(null);
    const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
    const [view, setView] = useState({
        center: [19.0760, 72.8777] as [number, number], // Default Mumbai
        zoom: 15
    });

    useEffect(() => {
        if (liveLat && liveLng && !searchResults) {
            setView({
                center: [liveLat, liveLng],
                zoom: 16
            });
        }
    }, [liveLat, liveLng, searchResults]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            // Geocoding using Mapbox API
            const geoResponse = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}`
            );
            const geoData = await geoResponse.json();

            if (geoData.features && geoData.features.length > 0) {
                const [destLng, destLat] = geoData.features[0].center;
                const name = geoData.features[0].place_name;
                setSearchResults({ lat: destLat, lng: destLng, name });

                // Directions using Mapbox API
                if (liveLat && liveLng) {
                    const directionsResponse = await fetch(
                        `https://api.mapbox.com/directions/v5/mapbox/driving/${liveLng},${liveLat};${destLng},${destLat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
                    );
                    const directionsData = await directionsResponse.json();
                    if (directionsData.routes && directionsData.routes.length > 0) {
                        // Leaflet uses [lat, lng] while GeoJSON uses [lng, lat]
                        const coords = directionsData.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
                        setRouteCoords(coords);
                    }
                }

                setView({
                    center: [destLat, destLng],
                    zoom: 16
                });
            }
        } catch (err) {
            console.error("Search or routing failed:", err);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults(null);
        setRouteCoords(null);
        if (liveLat && liveLng) {
            setView({
                center: [liveLat, liveLng],
                zoom: 16
            });
        }
    };

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
        <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden border border-border/50 shadow-card bg-slate-900">
            {/* Search Overlay */}
            {!hideSearch && (
                <div className="absolute top-4 left-4 right-14 z-[1000]">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-x-0 -bottom-2 bg-black/10 blur-lg h-8 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative flex items-center bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/20">
                            <Search className="w-4 h-4 ml-4 text-slate-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search parking near..."
                                className="bg-transparent border-none focus-visible:ring-0 text-sm h-11 placeholder:text-slate-400 placeholder:font-medium"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="p-2 mr-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <MapContainer
                center={view.center}
                zoom={view.zoom}
                style={{ width: "100%", height: "100%" }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapUpdater center={view.center} zoom={view.zoom} />

                {/* Route Line */}
                {routeCoords && (
                    <Polyline
                        positions={routeCoords}
                        pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.8 }}
                    />
                )}

                {/* Live Position Marker */}
                {liveLat && liveLng && (
                    <Marker
                        position={[liveLat, liveLng]}
                        icon={createCustomIcon('live')}
                    />
                )}

                {/* Searched Position Marker */}
                {searchResults && (
                    <Marker
                        position={[searchResults.lat, searchResults.lng]}
                        icon={createCustomIcon('search')}
                    />
                )}
            </MapContainer>

            {/* Recenter Button */}
            <Button
                className="absolute bottom-6 right-6 w-12 h-12 rounded-2xl gradient-primary shadow-lg shadow-primary/30 flex items-center justify-center transition-transform active:scale-95 z-[1000]"
                onClick={() => {
                    if (liveLat && liveLng) {
                        setView({
                            center: [liveLat, liveLng],
                            zoom: 16
                        });
                    }
                }}
            >
                <Navigation className="w-5 h-5 text-white" />
            </Button>

            <style>
                {`
                .custom-leaflet-icon {
                    background: none;
                    border: none;
                }
                .leaflet-grab {
                    cursor: crosshair;
                }
                `}
            </style>
        </div>
    );
};

export default LiveMap;
