import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Variáveis VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não configuradas. Verifique seu .env.local.'
  );
}

export const rateLimiter = {
  lastCall: {} as Record<string, number>,
  
  canCall(key: string, minInterval = 500): boolean {
    const now = Date.now();
    const lastCall = this.lastCall[key] || 0;
    
    if (now - lastCall < minInterval) {
      console.log(`[RateLimit] 🚫 Bloqueando chamada: ${key} (aguardar ${minInterval - (now - lastCall)}ms)`);
      return false;
    }
    
    this.lastCall[key] = now;
    return true;
  },
  
  reset(key: string): void {
    delete this.lastCall[key];
    console.log(`[RateLimit] 🔄 Rate limiter resetado para: ${key}`);
  },
  
  resetAll(): void {
    this.lastCall = {};
    console.log('[RateLimit] 🔄 Todos os rate limiters resetados');
  }
};

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    fetch: (url, options = {}) => {
      const urlString = url.toString();
      
      if (urlString.includes('/auth/v1/token') || 
          urlString.includes('/auth/v1/user') ||
          urlString.includes('grant_type=password')) {
        return fetch(url, options);
      }
      
      if (urlString.includes('/profiles')) {
        return fetch(url, options);
      }
      
      return fetch(url, options);
    },
  },
});

export async function testConnection() {
  const { data, error } = await supabase
    .from('teste_mcp')
    .select('*')
    .limit(1);

  return { data, error };
}
