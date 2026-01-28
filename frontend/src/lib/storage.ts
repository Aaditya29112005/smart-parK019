import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type {
    Vehicle,
    Driver,
    ParkingSession,
    DbVehicle,
    DbDriver,
    DbParkingSession,
} from "./database.types";
import {
    dbToVehicle,
    vehicleToDb,
    dbToDriver,
    driverToDb,
    dbToSession,
    sessionToDb,
} from "./database.types";

// Re-export types for backward compatibility
export type { Vehicle, Driver, ParkingSession };

const STORAGE_KEYS = {
    VEHICLES: 'smart_park_vehicles',
    SESSIONS: 'smart_park_sessions',
    DRIVERS: 'smart_park_drivers',
    USER: 'smart_park_user',
};

const notify = () => {
    window.dispatchEvent(new CustomEvent('smart_park_data_updated'));
};

// Helper to get local storage data safely
const getLocalValues = <T>(key: string): T[] => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// Helper to save to local storage safely
const saveLocalValue = <T>(key: string, value: T[]) => {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
};

// Check if user is in demo mode
// Force demo mode if Supabase is not properly configured
const isDemo = () => {
    if (!isSupabaseConfigured) return true;
    return localStorage.getItem("pixel-park-demo-session") === "true";
};

// Get current user ID
const getUserId = async (): Promise<string | null> => {
    if (isDemo()) return null;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id || null;
    } catch {
        return null;
    }
};

const DEMO_VEHICLES: Vehicle[] = [
    { id: 1, name: "Mercedes G-Wagon", plateNumber: "MH 01 DX 007", type: 'car', ownerName: "Aditya S." },
    { id: 2, name: "BMW M4 Competition", plateNumber: "MH 02 CZ 4444", type: 'car', ownerName: "Aditya S." },
    { id: 1706277600000, name: "Range Rover Sport", plateNumber: "TS 09 EQ 9999", type: 'car', ownerName: "Aditya S." },
];

const DEMO_DRIVERS: Driver[] = [
    { id: 1, fullName: "Rajesh Kumar", phone: "+91 98221 00001", licenseNumber: "MH12 2018 0001", status: 'approved' },
    { id: 2, fullName: "Suresh Raina", phone: "+91 91221 00002", licenseNumber: "DL14 2019 1234", status: 'approved' },
];

const DEMO_SESSIONS: ParkingSession[] = [
    {
        id: "TK-2024-01-25-001",
        vehicleId: 1,
        vehicleName: "Mercedes G-Wagon",
        plateNumber: "MH 01 DX 007",
        location: "Phoenix Palladium",
        address: "Lower Parel, Mumbai",
        entryTime: new Date(Date.now() - 86400000 * 2).toISOString(),
        exitTime: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString(),
        duration: "2h",
        amount: 250,
        status: 'completed'
    },
    {
        id: "TK-2024-01-26-002",
        vehicleId: 2,
        vehicleName: "BMW M4 Competition",
        plateNumber: "MH 02 CZ 4444",
        location: "Jio World Drive",
        address: "BKC, Mumbai",
        entryTime: new Date(Date.now() - 86400000).toISOString(),
        exitTime: new Date(Date.now() - 86400000 + 3600000).toISOString(),
        duration: "1h",
        amount: 150,
        status: 'completed'
    }
];

export const StorageService = {
    // ==================== VEHICLES ====================
    getVehicles: async (): Promise<Vehicle[]> => {
        // Always fetch local data, do not use default demo data for merging
        const localData = getLocalValues<Vehicle>(STORAGE_KEYS.VEHICLES);

        if (isDemo()) {
            // Only if local is explicitly empty do we use defaults in demo mode? 
            // Or logic remains: if no local, use defaults.
            // But getLocalValues returns [] if empty.
            const stored = localStorage.getItem(STORAGE_KEYS.VEHICLES);
            return stored ? JSON.parse(stored) : DEMO_VEHICLES;
        }

        const userId = await getUserId();
        // If no user, fallback to local (demo/offline) behavior
        if (!userId) {
            const stored = localStorage.getItem(STORAGE_KEYS.VEHICLES);
            return stored ? JSON.parse(stored) : DEMO_VEHICLES;
        }

        try {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            const remoteVehicles = (data as DbVehicle[]).map(dbToVehicle);

            // MERGE: Combine remote and local, unique by ID
            // Local items (that failed to sync) often have numeric IDs from Date.now()
            // Remote items usually have numeric IDs from SQL sequence. 
            // We use a Map to dedup by ID.
            const merged = new Map<number, Vehicle>();

            // Add remote first
            remoteVehicles.forEach(v => merged.set(v.id, v));
            // Add local second (preserves local edits if ID matches, or adds if missing)
            // Ideally we want remote to win if same ID, but local to exist if failing to sync?
            // If sync failed, it was a NEW item with a NEW ID. So no collision.
            localData.forEach(v => {
                if (!merged.has(v.id)) merged.set(v.id, v);
            });

            return Array.from(merged.values()).sort((a, b) => b.id - a.id); // Sort desc

        } catch (error) {
            console.error('Error fetching vehicles, falling back to local:', error);
            // Fallback: return strictly local data (or demo defaults if empty?)
            // If error, we are effectively offline.
            const stored = localStorage.getItem(STORAGE_KEYS.VEHICLES);
            return stored ? JSON.parse(stored) : DEMO_VEHICLES;
        }
    },

    addVehicle: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
        const saveLocal = async () => {
            const vehicles = await StorageService.getVehicles();
            const newVehicle = { ...vehicle, id: Date.now() };
            // Ensure unique ID if somehow colliding
            const updated = [newVehicle, ...vehicles];
            saveLocalValue(STORAGE_KEYS.VEHICLES, updated);
            return newVehicle;
        };

        if (isDemo()) return saveLocal();

        try {
            const userId = await getUserId();
            if (!userId) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('vehicles')
                .insert([vehicleToDb(vehicle, userId)])
                .select()
                .single();

            if (error) throw error;
            notify();
            return dbToVehicle(data as DbVehicle);
        } catch (error) {
            console.error("Supabase failed, falling back to local:", error);
            return saveLocal();
        }
    },

    deleteVehicle: async (id: number): Promise<void> => {
        const deleteLocal = async () => {
            const vehicles = await StorageService.getVehicles();
            const updated = vehicles.filter(v => v.id !== id);
            saveLocalValue(STORAGE_KEYS.VEHICLES, updated);
        };

        if (isDemo()) return deleteLocal();

        try {
            const { error } = await supabase
                .from('vehicles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            notify();
        } catch {
            return deleteLocal();
        }
    },

    // ==================== DRIVERS ====================
    getDrivers: async (): Promise<Driver[]> => {
        const localData = getLocalValues<Driver>(STORAGE_KEYS.DRIVERS);

        if (isDemo()) {
            const stored = localStorage.getItem(STORAGE_KEYS.DRIVERS);
            return stored ? JSON.parse(stored) : DEMO_DRIVERS;
        }

        const userId = await getUserId();
        if (!userId) {
            const stored = localStorage.getItem(STORAGE_KEYS.DRIVERS);
            return stored ? JSON.parse(stored) : DEMO_DRIVERS;
        }

        try {
            const { data, error } = await supabase
                .from('drivers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            const remoteDrivers = (data as DbDriver[]).map(dbToDriver);

            // MERGE
            const merged = new Map<number, Driver>();
            remoteDrivers.forEach(d => merged.set(d.id, d));
            localData.forEach(d => {
                if (!merged.has(d.id)) merged.set(d.id, d);
            });

            return Array.from(merged.values()).sort((a, b) => b.id - a.id);
        } catch (error) {
            const stored = localStorage.getItem(STORAGE_KEYS.DRIVERS);
            return stored ? JSON.parse(stored) : DEMO_DRIVERS;
        }
    },

    addDriver: async (driver: Omit<Driver, 'id' | 'status'>): Promise<Driver> => {
        const saveLocal = async () => {
            const drivers = await StorageService.getDrivers();
            const newDriver = { ...driver, id: Date.now(), status: 'pending' as const };
            const updated = [newDriver, ...drivers];
            saveLocalValue(STORAGE_KEYS.DRIVERS, updated);
            return newDriver;
        };

        if (isDemo()) return saveLocal();

        try {
            const userId = await getUserId();
            if (!userId) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('drivers')
                .insert([driverToDb(driver, userId)])
                .select()
                .single();

            if (error) throw error;
            notify();
            return dbToDriver(data as DbDriver);
        } catch {
            return saveLocal();
        }
    },

    deleteDriver: async (id: number): Promise<void> => {
        const deleteLocal = async () => {
            const drivers = await StorageService.getDrivers();
            const updated = drivers.filter(d => d.id !== id);
            saveLocalValue(STORAGE_KEYS.DRIVERS, updated);
        };

        if (isDemo()) return deleteLocal();

        try {
            const { error } = await supabase
                .from('drivers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            notify();
        } catch {
            return deleteLocal();
        }
    },

    // Update driver status (Approve/Reject)
    updateDriverStatus: async (id: number, status: 'approved' | 'rejected'): Promise<void> => {
        const updateLocal = async () => {
            const drivers = await StorageService.getDrivers();
            const updated = drivers.map(d =>
                d.id === id ? { ...d, status } : d
            );
            saveLocalValue(STORAGE_KEYS.DRIVERS, updated);
        };

        if (isDemo()) return updateLocal();

        try {
            const { error } = await supabase
                .from('drivers')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            notify();
        } catch {
            return updateLocal();
        }
    },

    // ==================== PARKING SESSIONS ====================
    getSessions: async (): Promise<ParkingSession[]> => {
        const localData = getLocalValues<ParkingSession>(STORAGE_KEYS.SESSIONS);

        if (isDemo()) {
            const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
            if (!stored) {
                saveLocalValue(STORAGE_KEYS.SESSIONS, DEMO_SESSIONS);
                return DEMO_SESSIONS;
            }
            return JSON.parse(stored);
        }

        const userId = await getUserId();
        if (!userId) {
            const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
            // Similar logic for demo seeding if completely empty? 
            // Maybe safer to not seed in fallback mode to avoid confusion.
            if (!stored) return DEMO_SESSIONS;
            return JSON.parse(stored);
        }

        try {
            const { data, error } = await supabase
                .from('parking_sessions')
                .select('*')
                .order('entry_time', { ascending: false });

            if (error) throw error;
            const remoteSessions = (data as DbParkingSession[]).map(dbToSession);

            // MERGE
            // Sessions use string IDs
            const merged = new Map<string, ParkingSession>();
            remoteSessions.forEach(s => merged.set(s.id, s));
            localData.forEach(s => {
                if (!merged.has(s.id)) merged.set(s.id, s);
            });

            // Sort by entryTime desc
            return Array.from(merged.values()).sort((a, b) =>
                new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
            );

        } catch (error) {
            const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
            if (!stored) return DEMO_SESSIONS;
            return JSON.parse(stored);
        }
    },

    getActiveSession: async (): Promise<ParkingSession | null> => {
        const sessions = await StorageService.getSessions();
        return sessions.find(s => s.status === 'active') || null;
    },

    startSession: async (vehicle: Vehicle, location = "Inorbit Mall"): Promise<ParkingSession> => {
        const sessionId = `TK-${new Date().toISOString().slice(0, 10)}-${Math.floor(Math.random() * 1000)}`;
        const newSession: Omit<ParkingSession, 'id'> = {
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            plateNumber: vehicle.plateNumber,
            location: location,
            address: "Lower Parel, Mumbai",
            entryTime: new Date().toISOString(),
            amount: 150,
            status: 'active',
        };

        const saveLocal = async () => {
            const sessions = await StorageService.getSessions();
            const session = { id: sessionId, ...newSession };
            const updated = [session, ...sessions];
            saveLocalValue(STORAGE_KEYS.SESSIONS, updated);
            return session;
        }

        if (isDemo()) return saveLocal();

        try {
            const userId = await getUserId();
            if (!userId) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('parking_sessions')
                .insert([sessionToDb(newSession, userId, sessionId)])
                .select()
                .single();

            if (error) throw error;
            notify();
            return dbToSession(data as DbParkingSession);
        } catch {
            return saveLocal();
        }
    },

    completeSession: async (sessionId: string): Promise<void> => {
        const updateLocal = async () => {
            const sessions = await StorageService.getSessions();
            const updated = sessions.map(s => {
                if (s.id === sessionId) {
                    const entry = new Date(s.entryTime);
                    const exit = new Date();
                    const durationMs = exit.getTime() - entry.getTime();
                    const hours = Math.ceil(durationMs / (1000 * 60 * 60));

                    return {
                        ...s,
                        status: 'completed' as const,
                        exitTime: exit.toISOString(),
                        duration: `${hours}h`,
                        amount: Math.max(150, hours * 40),
                    };
                }
                return s;
            });
            saveLocalValue(STORAGE_KEYS.SESSIONS, updated);
        };

        if (isDemo()) return updateLocal();

        try {
            const sessions = await StorageService.getSessions();
            const session = sessions.find(s => s.id === sessionId);
            // If session not found in remote (or remote failed), maybe it was local only?
            if (!session) throw new Error('Session not found');

            const entry = new Date(session.entryTime);
            const exit = new Date();
            const durationMs = exit.getTime() - entry.getTime();
            const hours = Math.ceil(durationMs / (1000 * 60 * 60));

            const { error } = await supabase
                .from('parking_sessions')
                .update({
                    status: 'completed',
                    exit_time: exit.toISOString(),
                    duration: `${hours}h`,
                    amount: Math.max(150, hours * 40),
                })
                .eq('id', sessionId);

            if (error) throw error;
            notify();
        } catch {
            return updateLocal();
        }
    },

    // ==================== ANALYTICS ====================
    getAnalytics: async () => {
        const sessions = await StorageService.getSessions();
        const completed = sessions.filter(s => s.status === 'completed');
        const totalRevenue = completed.reduce((acc, s) => acc + s.amount, 0);
        const totalHours = completed.reduce((acc, s) => acc + parseInt(s.duration || "0"), 0);
        const activeCount = sessions.filter(s => s.status === 'active').length;

        return {
            totalRevenue,
            totalHours,
            activeCount,
            historyCount: completed.length
        };
    }
};
