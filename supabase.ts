/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ ATENÇÃO: As chaves do Supabase não foram detectadas no import.meta.env.');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key prefix:', supabaseAnonKey.substring(0, 15));

let supabaseClient: any = null;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ ATENÇÃO: As chaves do Supabase não foram detectadas. O sistema funcionará em modo offline/demo.');
  } else {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (e) {
  console.error('Erro ao inicializar Supabase:', e);
}

export const supabase = supabaseClient;
