import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, Layers, Mic, MicOff, Volume2, X, BrainCircuit } from "lucide-react";
import LiveMap, { LiveMapRef } from "@/components/parking/LiveMap";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Speech Recognition Types (since they are not in global standard yet)
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const MapExplorer = () => {
    const navigate = useNavigate();
    const mapRef = useRef<LiveMapRef>(null);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const current = event.resultIndex;
                const result = event.results[current][0].transcript;
                setTranscript(result);

                if (event.results[current].isFinal) {
                    processVoiceCommand(result);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
                toast.error("Voice recognition failed. Try again.");
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const processVoiceCommand = useCallback((command: string) => {
        const cleanCommand = command.toLowerCase().trim();

        if (cleanCommand.includes("recenter") || cleanCommand.includes("my location")) {
            mapRef.current?.recenter();
            speak("Recentering map to your location.");
            toast.success("Recentered");
        } else {
            // Assume it's a location search
            const locationQuery = cleanCommand.replace("find", "").replace("search", "").replace("parking in", "").replace("parking near", "").trim();
            if (locationQuery) {
                speak(`Searching for parking near ${locationQuery}`);
                mapRef.current?.search(locationQuery);
            }
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            if (!recognitionRef.current) {
                toast.error("Voice recognition not supported in this browser.");
                return;
            }
            setTranscript("");
            recognitionRef.current.start();
            setIsListening(true);
            toast.info("Listening for commands...");
        }
    };

    return (
        <div className="h-full w-full bg-background flex flex-col relative overflow-hidden">
            {/* Full Screen Map Container */}
            <div className="absolute inset-0 z-0 text-white">
                <LiveMap ref={mapRef} hideSearch={true} hideRecenter={false} />
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

            {/* Listening Overlay */}
            {isListening && (
                <div className="absolute inset-0 z-[100] bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-white/95 rounded-[3rem] p-10 shadow-2xl border border-white/20 flex flex-col items-center gap-8 max-w-[85%] text-center">
                        <div className="relative">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                                <Mic className="w-10 h-10 text-primary animate-bounce" />
                            </div>
                            <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-25" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-primary font-black uppercase tracking-[0.2em] text-sm">How can I help?</h2>
                            <p className="text-slate-600 font-bold min-h-[1.5em] italic">
                                {transcript || "Try saying 'Find parking in Mumbai'..."}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="w-1.5 bg-primary rounded-full animate-wave"
                                    style={{
                                        height: `${Math.random() * 30 + 10}px`,
                                        animationDelay: `${i * 0.1}s`
                                    }}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={toggleListening}
                            variant="destructive"
                            className="rounded-2xl h-12 px-8 font-black uppercase text-xs tracking-widest shadow-lg shadow-destructive/20"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

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

                <div className="flex flex-col gap-3 pointer-events-auto">
                    {/* Voice Assistant Toggle */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse group-hover:bg-primary/30" />
                        <Button
                            onClick={toggleListening}
                            className={`w-16 h-16 rounded-[2rem] shadow-2xl flex items-center justify-center transition-all active:scale-90 relative z-10 ${isListening ? 'bg-destructive shadow-destructive/30' : 'gradient-primary shadow-primary/30 hover:scale-105'}`}
                        >
                            {isListening ? (
                                <MicOff className="w-7 h-7 text-white" />
                            ) : (
                                <div className="relative">
                                    <Mic className="w-7 h-7 text-white" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-primary rounded-full animate-ping" />
                                </div>
                            )}
                        </Button>
                        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Volume2 className="w-3 h-3" /> Voice Assistant
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                @keyframes wave {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(2.5); }
                }
                .animate-wave {
                    animation: wave 1s ease-in-out infinite;
                }
                `}
            </style>
        </div>
    );
};

export default MapExplorer;
