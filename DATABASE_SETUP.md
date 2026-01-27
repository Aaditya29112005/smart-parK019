# Database Setup Guide

This guide will help you set up the Supabase database for real data persistence.

## Prerequisites

- A Supabase account (free tier works fine)
- Your Supabase project URL and anon key in `.env`

## Step 1: Run Database Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `backend/migrations/001_setup_database.sql`
6. Paste into the SQL editor
7. Click **Run** or press `Ctrl/Cmd + Enter`

You should see: "Success. No rows returned"

## Step 2: Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `profiles`
   - `vehicles`
   - `drivers`
   - `parking_sessions`

## Step 3: Test the Application

### Demo Mode (No Database Required)
1. Visit your app
2. Click "Demo Access"
3. Data is stored in localStorage only

### Real Mode (Uses Database)
1. Visit your app
2. Click "Join Network" to sign up
3. Or use "Access Link" to log in
4. Add a vehicle - it will be saved to Supabase!
5. Check your Supabase Table Editor to see the data

## How It Works

The app automatically detects your mode:

- **Demo Mode**: Uses localStorage (no account needed)
- **Real Mode**: Uses Supabase database (requires login)

All components work the same way in both modes!

## Viewing Your Data

### In Supabase Dashboard
1. Go to **Table Editor**
2. Select a table (e.g., `vehicles`)
3. See all your data with proper user isolation

### In Your App
- **My Vehicles**: See your registered vehicles
- **History**: View parking session history
- **Settings**: Manage your account

## Row Level Security (RLS)

Your data is protected:
- Users can only see their own data
- Each table has RLS policies enabled
- Data is isolated by `user_id`

## Optional: Seed Test Data

If you want some test data:

1. Sign up for an account
2. Copy your user ID from the `auth.users` table
3. Edit `backend/migrations/002_seed_data.sql`
4. Replace `YOUR_USER_ID` with your actual user ID
5. Run the seed script in SQL Editor

## Troubleshooting

### "User not authenticated" error
- Make sure you're logged in (not in demo mode)
- Check that your `.env` has correct Supabase credentials

### Data not showing up
- Refresh the page
- Check Supabase Table Editor to verify data exists
- Check browser console for errors

### RLS Policy errors
- Make sure you ran the full migration script
- Verify RLS is enabled on all tables
- Check that policies were created

## Database Schema

```
profiles
├── id (uuid, FK to auth.users)
├── full_name
├── phone
└── avatar_url

vehicles
├── id (bigint)
├── user_id (uuid, FK to auth.users)
├── name
├── plate_number
├── type (car/bike)
├── owner_name
└── owner_phone

drivers
├── id (bigint)
├── user_id (uuid, FK to auth.users)
├── full_name
├── phone
├── license_number
├── status (approved/pending)
└── avatar_url

parking_sessions
├── id (text)
├── user_id (uuid, FK to auth.users)
├── vehicle_id (bigint, FK to vehicles)
├── vehicle_name
├── plate_number
├── location
├── address
├── entry_time
├── exit_time
├── duration
├── amount
└── status (active/completed)
```

## Next Steps

- Customize the seed data
- Add more fields to tables as needed
- Set up database backups in Supabase
- Monitor usage in Supabase dashboard

Your app now has real, persistent data! 🎉
