-- Smart Park Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- VEHICLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    plate_number TEXT NOT NULL,
    type TEXT CHECK (type IN ('car', 'bike')) DEFAULT 'car',
    owner_name TEXT,
    owner_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for vehicles
CREATE INDEX IF NOT EXISTS vehicles_user_id_idx ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS vehicles_plate_number_idx ON public.vehicles(plate_number);

-- RLS Policies for vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vehicles"
    ON public.vehicles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles"
    ON public.vehicles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles"
    ON public.vehicles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles"
    ON public.vehicles FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- DRIVERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.drivers (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    license_number TEXT NOT NULL,
    status TEXT CHECK (status IN ('approved', 'pending', 'rejected')) DEFAULT 'pending',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for drivers
CREATE INDEX IF NOT EXISTS drivers_user_id_idx ON public.drivers(user_id);
CREATE INDEX IF NOT EXISTS drivers_status_idx ON public.drivers(status);

-- RLS Policies for drivers
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own drivers"
    ON public.drivers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drivers"
    ON public.drivers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drivers"
    ON public.drivers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drivers"
    ON public.drivers FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- PARKING SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.parking_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vehicle_id BIGINT REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    vehicle_name TEXT NOT NULL,
    plate_number TEXT NOT NULL,
    location TEXT NOT NULL,
    address TEXT,
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exit_time TIMESTAMP WITH TIME ZONE,
    duration TEXT,
    amount DECIMAL(10, 2) DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'completed')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for parking_sessions
CREATE INDEX IF NOT EXISTS parking_sessions_user_id_idx ON public.parking_sessions(user_id);
CREATE INDEX IF NOT EXISTS parking_sessions_vehicle_id_idx ON public.parking_sessions(vehicle_id);
CREATE INDEX IF NOT EXISTS parking_sessions_status_idx ON public.parking_sessions(status);
CREATE INDEX IF NOT EXISTS parking_sessions_entry_time_idx ON public.parking_sessions(entry_time DESC);

-- RLS Policies for parking_sessions
ALTER TABLE public.parking_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own parking sessions"
    ON public.parking_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own parking sessions"
    ON public.parking_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own parking sessions"
    ON public.parking_sessions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own parking sessions"
    ON public.parking_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
    BEFORE UPDATE ON public.drivers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parking_sessions_updated_at
    BEFORE UPDATE ON public.parking_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
