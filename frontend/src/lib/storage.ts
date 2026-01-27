export interface Vehicle {
    id: number;
    name: string;
    plateNumber: string;
    type: 'car' | 'bike';
    ownerName?: string;
    ownerPhone?: string;
}

export interface Driver {
    id: number;
    fullName: string;
    phone: string;
    licenseNumber: string;
    status: 'approved' | 'pending';
    avatarUrl?: string;
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
    DRIVERS: 'smart_park_drivers',
    USER: 'smart_park_user',
};

const notify = () => {
    window.dispatchEvent(new CustomEvent('smart_park_data_updated'));
};

export const StorageService = {
    // Vehicles
    getVehicles: (): Vehicle[] => {
        const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
        return data ? JSON.parse(data) : [
            { id: 1, name: "Mercedes G-Wagon", plateNumber: "MH 01 DX 007", type: 'car', ownerName: "Aditya S." },
            { id: 2, name: "BMW M4 Competition", plateNumber: "MH 02 CZ 4444", type: 'car', ownerName: "Aditya S." },
            { id: 1706277600000, name: "Range Rover Sport", plateNumber: "TS 09 EQ 9999", type: 'car', ownerName: "Aditya S." },
        ];
    },

    addVehicle: (vehicle: Omit<Vehicle, 'id'>) => {
        const vehicles = StorageService.getVehicles();
        const newVehicle = { ...vehicle, id: Date.now() };
        const updated = [newVehicle, ...vehicles];
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
        notify();
        return newVehicle;
    },

    // Drivers
    getDrivers: (): Driver[] => {
        const data = localStorage.getItem(STORAGE_KEYS.DRIVERS);
        return data ? JSON.parse(data) : [
            { id: 1, fullName: "Rajesh Kumar", phone: "+91 98221 00001", licenseNumber: "MH12 2018 0001", status: 'approved' },
            { id: 2, fullName: "Suresh Raina", phone: "+91 91221 00002", licenseNumber: "DL14 2019 1234", status: 'approved' },
        ];
    },

    addDriver: (driver: Omit<Driver, 'id' | 'status'>) => {
        const drivers = StorageService.getDrivers();
        const newDriver = { ...driver, id: Date.now(), status: 'pending' as const };
        const updated = [newDriver, ...drivers];
        localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(updated));
        notify();
        return newDriver;
    },

    // Sessions
    getSessions: (): ParkingSession[] => {
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
            amount: 150,
            status: 'active',
        };
        const updated = [newSession, ...sessions];
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
        notify();
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
                    amount: Math.max(150, hours * 40),
                };
            }
            return s;
        });
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
        notify();
    },

    deleteVehicle: (id: number) => {
        const vehicles = StorageService.getVehicles();
        const updated = vehicles.filter(v => v.id !== id);
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
        notify();
    },

    deleteDriver: (id: number) => {
        const drivers = StorageService.getDrivers();
        const updated = drivers.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(updated));
        notify();
    },

    getAnalytics: () => {
        const sessions = StorageService.getSessions();
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
