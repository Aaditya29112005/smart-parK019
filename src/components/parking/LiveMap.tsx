import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
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
    hideRecenter?: boolean;
}

export interface LiveMapRef {
    recenter: () => void;
    search: (query: string) => Promise<void>;
}

const LiveMap = forwardRef<LiveMapRef, LiveMapProps>(({ hideSearch = false, hideRecenter = false }, ref) => {
    const { latitude: liveLat, longitude: liveLng, error, loading } = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ lat: number; lng: number; name: string } | null>(null);
    const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
    const [view, setView] = useState({
        center: [19.0760, 72.8777] as [number, number], // Default Mumbai
        zoom: 15
    });

    const recenter = useCallback(() => {
        if (liveLat && liveLng) {
            setView({
                center: [liveLat, liveLng],
                zoom: 16
            });
        }
    }, [liveLat, liveLng]);

    const executeSearch = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setSearchQuery(query);

        try {
            const geoResponse = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}`
            );
            const geoData = await geoResponse.json();

            if (geoData.features && geoData.features.length > 0) {
                const [destLng, destLat] = geoData.features[0].center;
                const name = geoData.features[0].place_name;
                setSearchResults({ lat: destLat, lng: destLng, name });

                if (liveLat && liveLng) {
                    const directionsResponse = await fetch(
                        `https://api.mapbox.com/directions/v5/mapbox/driving/${liveLng},${liveLat};${destLng},${destLat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
                    );
                    const directionsData = await directionsResponse.json();
                    if (directionsData.routes && directionsData.routes.length > 0) {
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
    }, [liveLat, liveLng]);

    useImperativeHandle(ref, () => ({
        recenter,
        search: executeSearch
    }));

    const [suggestions, setSuggestions] = useState<{ id: string; place_name: string; center: [number, number] }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Fetch suggestions as user types
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 3) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`
                );
                const data = await response.json();
                if (data.features) {
                    setSuggestions(data.features.map((f: any) => ({
                        id: f.id,
                        place_name: f.place_name,
                        center: f.center
                    })));
                }
            } catch (err) {
                console.error("Failed to fetch suggestions:", err);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        executeSearch(searchQuery);
    };

    const selectSuggestion = (suggestion: { place_name: string; center: [number, number] }) => {
        setSearchQuery(suggestion.place_name);
        setSuggestions([]);
        setShowSuggestions(false);

        // Use the center from suggestion directly to avoid another geocode call
        const [destLng, destLat] = suggestion.center;
        setSearchResults({ lat: destLat, lng: destLng, name: suggestion.place_name });

        if (liveLat && liveLng) {
            fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${liveLng},${liveLat};${destLng},${destLat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`)
                .then(res => res.json())
                .then(directionsData => {
                    if (directionsData.routes && directionsData.routes.length > 0) {
                        const coords = directionsData.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
                        setRouteCoords(coords);
                    }
                });
        }

        setView({
            center: [destLat, destLng],
            zoom: 16
        });
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSuggestions([]);
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
                    <div className="relative group">
                        <div className="absolute inset-x-0 -bottom-2 bg-black/10 blur-lg h-8 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <form onSubmit={handleSearch} className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/20">
                            <Search className="w-4 h-4 ml-4 text-slate-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
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
                        </form>

                        {/* Suggestions List */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute mt-2 inset-x-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                {suggestions.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => selectSuggestion(s)}
                                        className="w-full px-5 py-4 text-left hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                                    >
                                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-primary mt-0.5 shrink-0" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-bold text-slate-800 truncate uppercase tracking-tight">
                                                {s.place_name.split(',')[0]}
                                            </p>
                                            <p className="text-[10px] text-slate-500 truncate uppercase opacity-60">
                                                {s.place_name.split(',').slice(1).join(',')}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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
            {!hideRecenter && (
                <Button
                    className="absolute bottom-6 right-6 w-12 h-12 rounded-2xl gradient-primary shadow-lg shadow-primary/30 flex items-center justify-center transition-transform active:scale-95 z-[1000]"
                    onClick={recenter}
                >
                    <Navigation className="w-5 h-5 text-white" />
                </Button>
            )}

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
});

export default LiveMap;
