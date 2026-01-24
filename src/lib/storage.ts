export interface Vehicle {
    id: number;
    name: string;
    plateNumber: string;
    type: 'car' | 'bike';
    ownerName?: string;
    ownerPhone?: string;
}

export interface ParkingSession {
    id: string;
    vehicleId: number;
    vehicleName: string;
    plateNumber: string;
    location: string;
    address: string;
    entryTime: string;
    exitTime?: string;
    duration?: string;
    amount: number;
    status: 'active' | 'completed';
}

const STORAGE_KEYS = {
    VEHICLES: 'smart_park_vehicles',
    SESSIONS: 'smart_park_sessions',
    USER: 'smart_park_user',
};

export const StorageService = {
    // Vehicles
    getVehicles: (): Vehicle[] => {
        const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
        return data ? JSON.parse(data) : [
            { id: 1, name: "Toyota Camry", plateNumber: "MH 12 AB 1234", type: 'car' },
            { id: 2, name: "Honda Civic", plateNumber: "MH 14 CD 5678", type: 'car' },
        ];
    },

    addVehicle: (vehicle: Omit<Vehicle, 'id'>) => {
        const vehicles = StorageService.getVehicles();
        const newVehicle = { ...vehicle, id: Date.now() };
        const updated = [...vehicles, newVehicle];
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
        return newVehicle;
    },

    // Sessions
    getSessions: (): ParkingSession[] => {
        const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
        return data ? JSON.parse(data) : [];
    },

    getActiveSession: (): ParkingSession | null => {
        const sessions = StorageService.getSessions();
        return sessions.find(s => s.status === 'active') || null;
    },

    startSession: (vehicle: Vehicle, location = "Inorbit Mall") => {
        const sessions = StorageService.getSessions();
        const newSession: ParkingSession = {
            id: `TK-${new Date().toISOString().slice(0, 10)}-${Math.floor(Math.random() * 1000)}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            plateNumber: vehicle.plateNumber,
            location: location,
            address: "Lower Parel, Mumbai",
            entryTime: new Date().toISOString(),
            amount: 150, // Default base amount
            status: 'active',
        };
        const updated = [newSession, ...sessions];
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
        return newSession;
    },

    completeSession: (sessionId: string) => {
        const sessions = StorageService.getSessions();
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
                    amount: Math.max(150, hours * 40), // Example rate
                };
            }
            return s;
        });
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    }
};
