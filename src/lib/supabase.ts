import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabasePublicKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

const isValidSupabaseUrl = (value?: string) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
};

export const supabaseConfigurationError = !supabaseUrl || !supabasePublicKey
  ? 'A configuração pública do Supabase não foi carregada neste ambiente.'
  : !isValidSupabaseUrl(supabaseUrl)
    ? 'A URL pública do Supabase é inválida.'
    : null;

export const supabaseConfigured = supabaseConfigurationError === null;

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabasePublicKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
