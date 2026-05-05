/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Variáveis do Supabase ausentes. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas configurações do projeto.');
}

// Log truncated values for security
console.log('--- SUPABASE CONFIG ---');
console.log('URL:', supabaseUrl);
console.log('Protocol:', supabaseUrl.startsWith('https') ? '✅ HTTPS' : '❌ NOT HTTPS');
console.log('Key prefix:', supabaseAnonKey.substring(0, 10) + '...');
console.log('-----------------------');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
