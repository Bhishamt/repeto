import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  mode: 'live' | 'mock';
  hasUrl: boolean;
  hasAnonKey: boolean;
}

export const getSupabaseStatus = (): SupabaseConfigStatus => ({
  isConfigured: isSupabaseConfigured,
  mode: isSupabaseConfigured ? 'live' : 'mock',
  hasUrl: Boolean(supabaseUrl),
  hasAnonKey: Boolean(supabaseAnonKey),
});

export const checkSupabaseHealth = async (): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('_health').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
};

