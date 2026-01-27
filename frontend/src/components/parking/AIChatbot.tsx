import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Bot, User, Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! I'm your Smart Parking Assistant. How can I help you today?",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-IN';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
                toast.error("Voice recognition failed.");
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (!recognitionRef.current) {
                toast.error("Voice recognition not supported.");
                return;
            }
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isTyping]);

    const handleSend = (textOverride?: string) => {
        const messageText = textOverride || input;
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            const responses = [
                "I can help you find the nearest parking spot.",
                "Your current parking session has 45 minutes remaining.",
                "Would you like to extend your parking time?",
                "I've updated your vehicle details successfully.",
                "The parking rate at Phoenix Mall is ₹40/hour.",
                "There is available parking at Jio World Drive with 55 slots free.",
                "Sure, I can navigate you to the nearest parking hub. Just say the word!"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
            speak(randomResponse); // AI Speaks back
        }, 1500);
    };

    return (
        <div className="absolute bottom-20 right-4 z-[60] flex flex-col items-end pointer-events-none">
            {isOpen && (
                <div className="w-[300px] h-[450px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
                    {/* Header */}
                    <div className="gradient-primary p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-xl">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-tight">AI Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-bold uppercase opacity-80">Voice Active</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                        <div className="space-y-4 pb-2">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${msg.sender === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        {isListening && (
                            <div className="flex justify-center items-center gap-2 mb-3 py-2 bg-primary/5 rounded-xl animate-pulse">
                                <Mic className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Listening...</span>
                            </div>
                        )}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex gap-2"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={toggleListening}
                                className={`rounded-xl shrink-0 h-10 w-10 border transition-all ${isListening ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-white border-slate-200 text-slate-400 hover:text-primary'}`}
                            >
                                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </Button>
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Speak or type..."
                                className="bg-white border-slate-200 rounded-xl text-xs h-10 shadow-none focus-visible:ring-1 focus-visible:ring-primary/20"
                            />
                            <Button type="submit" size="icon" className="rounded-xl shrink-0 h-10 w-10 shadow-primary/20">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* FAB */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-2xl shadow-lg shadow-primary/30 transition-all duration-300 pointer-events-auto ${isOpen ? "bg-slate-800 hover:bg-slate-900" : "gradient-primary"
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageSquare className="w-6 h-6 text-white" />
                )}
            </Button>
        </div>
    );
};

export default AIChatbot;
