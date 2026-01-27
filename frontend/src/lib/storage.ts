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

// Check if user is in demo mode
// Force demo mode if Supabase is not properly configured
const isDemo = () => {
    if (!isSupabaseConfigured) return true;
    return localStorage.getItem("pixel-park-demo-session") === "true";
};

// Get current user ID
const getUserId = async (): Promise<string | null> => {
    if (isDemo()) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
};

export const StorageService = {
    // ==================== VEHICLES ====================
    getVehicles: async (): Promise<Vehicle[]> => {
        if (isDemo()) {
            // Demo mode - use localStorage
            const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
            return data ? JSON.parse(data) : [
                { id: 1, name: "Mercedes G-Wagon", plateNumber: "MH 01 DX 007", type: 'car', ownerName: "Aditya S." },
                { id: 2, name: "BMW M4 Competition", plateNumber: "MH 02 CZ 4444", type: 'car', ownerName: "Aditya S." },
                { id: 1706277600000, name: "Range Rover Sport", plateNumber: "TS 09 EQ 9999", type: 'car', ownerName: "Aditya S." },
            ];
        }

        // Real mode - use Supabase
        try {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data as DbVehicle[]).map(dbToVehicle);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            return [];
        }
    },

    addVehicle: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
        if (isDemo()) {
            // Demo mode - use localStorage
            const vehicles = await StorageService.getVehicles();
            const newVehicle = { ...vehicle, id: Date.now() };
            const updated = [newVehicle, ...vehicles];
            localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
            notify();
            return newVehicle;
        }

        // Real mode - use Supabase
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
    },

    deleteVehicle: async (id: number): Promise<void> => {
        if (isDemo()) {
            // Demo mode - use localStorage
            const vehicles = await StorageService.getVehicles();
            const updated = vehicles.filter(v => v.id !== id);
            localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
            notify();
            return;
        }

        // Real mode - use Supabase
        const { error } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        notify();
    },

    // ==================== DRIVERS ====================
    getDrivers: async (): Promise<Driver[]> => {
        if (isDemo()) {
            // Demo mode - use localStorage
            const data = localStorage.getItem(STORAGE_KEYS.DRIVERS);
            return data ? JSON.parse(data) : [
                { id: 1, fullName: "Rajesh Kumar", phone: "+91 98221 00001", licenseNumber: "MH12 2018 0001", status: 'approved' },
                { id: 2, fullName: "Suresh Raina", phone: "+91 91221 00002", licenseNumber: "DL14 2019 1234", status: 'approved' },
            ];
        }

        // Real mode - use Supabase
        try {
            const { data, error } = await supabase
                .from('drivers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data as DbDriver[]).map(dbToDriver);
        } catch (error) {
            console.error('Error fetching drivers:', error);
            return [];
        }
    },

    addDriver: async (driver: Omit<Driver, 'id' | 'status'>): Promise<Driver> => {
        if (isDemo()) {
            // Demo mode - use localStorage
            const drivers = await StorageService.getDrivers();
            const newDriver = { ...driver, id: Date.now(), status: 'pending' as const };
            const updated = [newDriver, ...drivers];
            localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(updated));
            notify();
            return newDriver;
        }

        // Real mode - use Supabase
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
    },

    deleteDriver: async (id: number): Promise<void> => {
        if (isDemo()) {
            // Demo mode - use localStorage
            const drivers = await StorageService.getDrivers();
            const updated = drivers.filter(d => d.id !== id);
            localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(updated));
            notify();
            return;
        }

        // Real mode - use Supabase
        const { error } = await supabase
            .from('drivers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        notify();
    },

    // ==================== PARKING SESSIONS ====================
    getSessions: async (): Promise<ParkingSession[]> => {
        if (isDemo()) {
            // Demo mode - use localStorage
            const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
            if (!data) {
                // Seed some past sessions if empty
                const seedSessions: ParkingSession[] = [
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
                localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(seedSessions));
                return seedSessions;
            }
            return JSON.parse(data);
        }

        // Real mode - use Supabase
        try {
            const { data, error } = await supabase
                .from('parking_sessions')
                .select('*')
                .order('entry_time', { ascending: false });

            if (error) throw error;
            return (data as DbParkingSession[]).map(dbToSession);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            return [];
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

        if (isDemo()) {
            // Demo mode - use localStorage
            const sessions = await StorageService.getSessions();
            const session = { id: sessionId, ...newSession };
            const updated = [session, ...sessions];
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
            notify();
            return session;
        }

        // Real mode - use Supabase
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
    },

    completeSession: async (sessionId: string): Promise<void> => {
        if (isDemo()) {
            // Demo mode - use localStorage
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
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
            notify();
            return;
        }

        // Real mode - use Supabase
        const sessions = await StorageService.getSessions();
        const session = sessions.find(s => s.id === sessionId);
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
