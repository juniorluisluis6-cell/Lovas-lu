import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://coqkznwimuimkhdwhboa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qa2muieddWVKO0H7ghAhbQ_NhJR1IP_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
