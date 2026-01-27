-- Seed data for testing (OPTIONAL)
-- Run this after setup-database.sql if you want test data

-- Note: Replace 'YOUR_USER_ID' with an actual user UUID from auth.users
-- You can get this by signing up and checking the auth.users table

-- Example vehicles (update user_id)
-- INSERT INTO public.vehicles (user_id, name, plate_number, type, owner_name, owner_phone)
-- VALUES 
--     ('YOUR_USER_ID', 'Mercedes G-Wagon', 'MH 01 DX 007', 'car', 'Test User', '+91 98765 43210'),
--     ('YOUR_USER_ID', 'BMW M4 Competition', 'MH 02 CZ 4444', 'car', 'Test User', '+91 98765 43210'),
--     ('YOUR_USER_ID', 'Royal Enfield Classic', 'MH 12 AB 1234', 'bike', 'Test User', '+91 98765 43210');

-- Example drivers (update user_id)
-- INSERT INTO public.drivers (user_id, full_name, phone, license_number, status)
-- VALUES
--     ('YOUR_USER_ID', 'Rajesh Kumar', '+91 98221 00001', 'MH12 2018 0001', 'approved'),
--     ('YOUR_USER_ID', 'Suresh Raina', '+91 91221 00002', 'DL14 2019 1234', 'approved');

-- Example completed parking sessions (update user_id and vehicle_id)
-- INSERT INTO public.parking_sessions (id, user_id, vehicle_id, vehicle_name, plate_number, location, address, entry_time, exit_time, duration, amount, status)
-- VALUES
--     ('TK-2024-01-25-001', 'YOUR_USER_ID', 1, 'Mercedes G-Wagon', 'MH 01 DX 007', 'Phoenix Palladium', 'Lower Parel, Mumbai', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '2 hours', '2h', 250, 'completed'),
--     ('TK-2024-01-26-002', 'YOUR_USER_ID', 2, 'BMW M4 Competition', 'MH 02 CZ 4444', 'Jio World Drive', 'BKC, Mumbai', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '1 hour', '1h', 150, 'completed');
