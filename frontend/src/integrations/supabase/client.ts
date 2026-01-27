import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Robust initialization check
const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return !url.includes('YOUR_SUPABASE_URL') && !url.includes('placeholder');
    } catch {
        return false;
    }
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== 'placeholder-key';

if (!isSupabaseConfigured) {
    console.warn("⚠️ Supabase not configured. App will run in demo mode only.");
}

// Create client with valid or placeholder credentials
export const supabase = createClient(
    isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
    isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'
);
