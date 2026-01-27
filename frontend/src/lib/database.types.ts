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

// Database types (snake_case from Supabase)
export interface DbVehicle {
    id: number;
    user_id: string;
    name: string;
    plate_number: string;
    type: 'car' | 'bike';
    owner_name?: string;
    owner_phone?: string;
    created_at?: string;
    updated_at?: string;
}

export interface DbDriver {
    id: number;
    user_id: string;
    full_name: string;
    phone: string;
    license_number: string;
    status: 'approved' | 'pending' | 'rejected';
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface DbParkingSession {
    id: string;
    user_id: string;
    vehicle_id: number;
    vehicle_name: string;
    plate_number: string;
    location: string;
    address?: string;
    entry_time: string;
    exit_time?: string;
    duration?: string;
    amount: number;
    status: 'active' | 'completed';
    created_at?: string;
    updated_at?: string;
}

// Conversion helpers
export const dbToVehicle = (db: DbVehicle): Vehicle => ({
    id: db.id,
    name: db.name,
    plateNumber: db.plate_number,
    type: db.type,
    ownerName: db.owner_name,
    ownerPhone: db.owner_phone,
});

export const vehicleToDb = (vehicle: Omit<Vehicle, 'id'>, userId: string): Omit<DbVehicle, 'id' | 'created_at' | 'updated_at'> => ({
    user_id: userId,
    name: vehicle.name,
    plate_number: vehicle.plateNumber,
    type: vehicle.type,
    owner_name: vehicle.ownerName,
    owner_phone: vehicle.ownerPhone,
});

export const dbToDriver = (db: DbDriver): Driver => ({
    id: db.id,
    fullName: db.full_name,
    phone: db.phone,
    licenseNumber: db.license_number,
    status: db.status === 'rejected' ? 'pending' : db.status,
    avatarUrl: db.avatar_url,
});

export const driverToDb = (driver: Omit<Driver, 'id' | 'status'>, userId: string): Omit<DbDriver, 'id' | 'created_at' | 'updated_at'> => ({
    user_id: userId,
    full_name: driver.fullName,
    phone: driver.phone,
    license_number: driver.licenseNumber,
    status: 'pending',
    avatar_url: driver.avatarUrl,
});

export const dbToSession = (db: DbParkingSession): ParkingSession => ({
    id: db.id,
    vehicleId: db.vehicle_id,
    vehicleName: db.vehicle_name,
    plateNumber: db.plate_number,
    location: db.location,
    address: db.address || '',
    entryTime: db.entry_time,
    exitTime: db.exit_time,
    duration: db.duration,
    amount: db.amount,
    status: db.status,
});

export const sessionToDb = (session: Omit<ParkingSession, 'id'>, userId: string, id: string): Omit<DbParkingSession, 'created_at' | 'updated_at'> => ({
    id,
    user_id: userId,
    vehicle_id: session.vehicleId,
    vehicle_name: session.vehicleName,
    plate_number: session.plateNumber,
    location: session.location,
    address: session.address,
    entry_time: session.entryTime,
    exit_time: session.exitTime,
    duration: session.duration,
    amount: session.amount,
    status: session.status,
});
