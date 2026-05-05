/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing! VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined in environment variables.');
} else {
  const isPlaceholder = supabaseUrl.includes('placeholder.supabase.co');
  if (isPlaceholder) {
    console.warn('Supabase client is using PLACEHOLDER URL. Check your environment setup.');
  } else {
    // Basic URL validation
    try {
      const urlObj = new URL(supabaseUrl);
      console.log('Supabase client initialized. Host:', urlObj.host);
      if (!urlObj.host.includes('.supabase.co')) {
        console.warn('URL does not seem to be a standard Supabase host:', urlObj.host);
      }
    } catch (e) {
      console.error('INVALID Supabase URL provided:', supabaseUrl);
    }
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
