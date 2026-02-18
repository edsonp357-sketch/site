/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Using process.env to access environment variables as per project standards.
const SUPABASE_URL = (process.env as any).VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (process.env as any).VITE_SUPABASE_ANON_KEY || '';

/**
 * Initializes Supabase client only if credentials exist.
 * Exported as null if not configured to allow the App to use fallback storage.
 */
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * Helper to check if Supabase is ready for production use.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && supabase !== null);
};