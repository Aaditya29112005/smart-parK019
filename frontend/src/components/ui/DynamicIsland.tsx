import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, Car, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicIslandProps {
    state?: "idle" | "loading" | "success" | "active-session";
    message?: string;
}

export const DynamicIsland = ({ state: injectedState, message }: DynamicIslandProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [internalState, setInternalState] = useState<DynamicIslandProps["state"]>("idle");

    useEffect(() => {
        if (injectedState) {
            setInternalState(injectedState);
            // Auto expand on important states
            if (injectedState === "success" || injectedState === "active-session") {
                setIsExpanded(true);
                if (injectedState === "success") {
                    setTimeout(() => setIsExpanded(false), 3000);
                }
            }
        }
    }, [injectedState]);

    return (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex justify-center w-full pointer-events-none">
            <motion.div
                layout
                initial={false}
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "bg-black text-white cursor-pointer pointer-events-auto shadow-2xl overflow-hidden",
                    "mx-auto rounded-[2rem]",
                    isExpanded ? "w-[90%] max-w-[380px] rounded-[2.5rem]" : "w-[120px] h-[35px]"
                )}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
            >
                <motion.div layout className="flex items-center justify-between w-full h-full px-4 py-2">

                    {/* Compact State (Always Visible) */}
                    <div className="flex items-center justify-between w-full h-full">
                        {!isExpanded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center w-full gap-2"
                            >
                                {internalState === 'active-session' ? (
                                    <Clock className="w-3 h-3 text-green-400 animate-pulse" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                )}
                                <span className="text-[10px] font-medium text-white/80">Smart Park</span>
                            </motion.div>
                        )}

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.1 } }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col w-full"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                {internalState === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Car className="w-4 h-4 text-blue-400" />}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white leading-none">
                                                    {internalState === 'active-session' ? 'Active Session' : 'Notification'}
                                                </h4>
                                                <p className="text-[10px] text-white/60 mt-0.5">
                                                    {message || (internalState === 'active-session' ? 'Parking at Phoenix Mall' : 'System Online')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {internalState === 'active-session' && (
                                                <div className="text-xl font-bold text-green-400 font-mono">01:24</div>
                                            )}
                                        </div>
                                    </div>

                                    {internalState === 'active-session' && (
                                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-2">
                                            <motion.div
                                                className="bg-green-400 h-full"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "60%" }}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
