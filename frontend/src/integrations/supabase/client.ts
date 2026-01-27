import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Robust initialization check
const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return !url.includes('YOUR_SUPABASE_URL');
    } catch {
        return false;
    }
};

if (!isValidUrl(supabaseUrl)) {
    console.warn("Supabase URL is missing or invalid. Please update your .env file.");
}

export const supabase = createClient(
    isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
