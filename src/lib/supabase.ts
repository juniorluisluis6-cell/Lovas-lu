import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://adchmbtomvvspnstpiko.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZJwpnLqo7DoqQY3GrggPsA_kuw60-1p';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
