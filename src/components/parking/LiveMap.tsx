import { useState, useEffect, useCallback } from "react";
import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Navigation, Search, X } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AnyLayer } from "mapbox-gl";

// Placeholder token - User should provide their own for production
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTVoZG9rdm0wY2RsMmpxeHh4bm8zZzR4In0.1x3YF7_H-XQ9j7m5x-x6pA"; // Lovable default or user token

const LiveMap = () => {
    const { latitude: liveLat, longitude: liveLng, error, loading } = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ lat: number; lng: number; name: string } | null>(null);
    const [routeData, setRouteData] = useState<any>(null);
    const [viewport, setViewport] = useState({
        latitude: 19.0760, // Default to Mumbai
        longitude: 72.8777,
        zoom: 15,
        pitch: 60, // 3D Tilt
        bearing: 0,
    });

    useEffect(() => {
        if (liveLat && liveLng && !searchResults) {
            setViewport(prev => ({
                ...prev,
                latitude: liveLat,
                longitude: liveLng,
                zoom: 16,
            }));
        }
    }, [liveLat, liveLng, searchResults]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            // Geocoding
            const geoResponse = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    searchQuery
                )}.json?access_token=${MAPBOX_TOKEN}`
            );
            const geoData = await geoResponse.json();
            if (geoData.features && geoData.features.length > 0) {
                const [destLng, destLat] = geoData.features[0].center;
                const name = geoData.features[0].place_name;
                setSearchResults({ lat: destLat, lng: destLng, name });

                // If we have live location, get directions
                if (liveLat && liveLng) {
                    const directionsResponse = await fetch(
                        `https://api.mapbox.com/directions/v5/mapbox/driving/${liveLng},${liveLat};${destLng},${destLat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
                    );
                    const directionsData = await directionsResponse.json();
                    if (directionsData.routes && directionsData.routes.length > 0) {
                        setRouteData(directionsData.routes[0].geometry);
                    }
                }

                setViewport(prev => ({
                    ...prev,
                    latitude: destLat,
                    longitude: destLng,
                    zoom: 16,
                }));
            }
        } catch (err) {
            console.error("Search or routing failed:", err);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults(null);
        setRouteData(null);
        if (liveLat && liveLng) {
            setViewport(prev => ({
                ...prev,
                latitude: liveLat,
                longitude: liveLng,
                zoom: 16,
            }));
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
        <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden border border-border/50 shadow-card">
            {/* Search Overlay */}
            <div className="absolute top-4 left-4 right-14 z-20">
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

            <Map
                {...viewport}
                onMove={(evt) => setViewport(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/standard"
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
                attributionControl={false}
                terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
                maxPitch={85}
            >
                {/* Terrain Source for 3D Elevation */}
                <Source
                    id="mapbox-dem"
                    type="raster-dem"
                    url="mapbox://mapbox.mapbox-terrain-dem-v1"
                    tileSize={512}
                />
                {/* Route Layer */}
                {routeData && (
                    <Source id="route" type="geojson" data={{
                        type: 'Feature',
                        properties: {},
                        geometry: routeData
                    }}>
                        <Layer
                            id="route-line"
                            type="line"
                            layout={{
                                'line-join': 'round',
                                'line-cap': 'round'
                            }}
                            paint={{
                                'line-color': '#3b82f6', // primary blue
                                'line-width': 5,
                                'line-opacity': 0.8
                            }}
                        />
                    </Source>
                )}

                {/* Live Position Marker */}
                {liveLat && liveLng && (
                    <Marker latitude={liveLat} longitude={liveLng} anchor="bottom">
                        <div className="relative group">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center animate-ping absolute -top-1 -left-1" />
                            <div className="w-8 h-8 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-primary relative z-10 transition-transform hover:scale-110">
                                <Navigation className="w-4 h-4 text-primary fill-primary" />
                            </div>
                        </div>
                    </Marker>
                )}

                {/* Searched Position Marker */}
                {searchResults && (
                    <Marker latitude={searchResults.lat} longitude={searchResults.lng} anchor="bottom">
                        <div className="relative animate-bounce">
                            <div className="w-12 h-12 bg-white rounded-[1.25rem] shadow-2xl flex items-center justify-center border-2 border-green-500 relative z-10">
                                <MapPin className="w-6 h-6 text-green-500 fill-green-50" />
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 blur-sm rounded-full" />
                        </div>
                    </Marker>
                )}
                <div className="absolute top-4 right-4">
                    <NavigationControl showCompass={false} />
                </div>

                {/* Recenter Button */}
                <Button
                    className="absolute bottom-6 right-6 w-12 h-12 rounded-2xl gradient-primary shadow-lg shadow-primary/30 flex items-center justify-center transition-transform active:scale-95"
                    onClick={() => {
                        if (liveLat && liveLng) {
                            setViewport(prev => ({
                                ...prev,
                                latitude: liveLat,
                                longitude: liveLng,
                                zoom: 16,
                            }));
                        }
                    }}
                >
                    <Navigation className="w-5 h-5 text-white" />
                </Button>
            </Map>
            <style>
                {`
                .mapboxgl-ctrl-logo {
                    display: none !important;
                }
                .mapboxgl-ctrl-attrib {
                    display: none !important;
                }
                `}
            </style>
        </div>
    );
};

export default LiveMap;
