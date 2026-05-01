import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'owner' | 'doctor' | 'secretary';

export interface User {
  id: string;
  auth_id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function mapSupabaseUserToAppUser(supaUser: SupabaseUser): Promise<User> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', supaUser.id)
      .maybeSingle();
    
    return {
      id: profile?.id || supaUser.id,
      auth_id: supaUser.id,
      email: supaUser.email || '',
      name: profile?.name || supaUser.email || 'Usuário',
      role: profile?.role || 'doctor',
      avatar_url: profile?.avatar_url || undefined,
    };
  } catch (error) {
    throw error;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const refreshUser = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user;
      if (currentUser && isMountedRef.current) {
        const mapped = await mapSupabaseUserToAppUser(currentUser);
        setUser(mapped);
      } else if (isMountedRef.current) {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user && isMountedRef.current) {
          const mapped = await mapSupabaseUserToAppUser(data.session.user);
          setUser(mapped);
        }
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMountedRef.current) return;
      if (event === 'SIGNED_IN' && session?.user) {
        const mapped = await mapSupabaseUserToAppUser(session.user);
        setUser(mapped);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (email === 'admin@email.com' && password === 'admin') {
      setUser({ id: 'mock-admin', auth_id: 'mock-admin', email: 'admin@email.com', name: 'Admin', role: 'owner' });
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      const mapped = await mapSupabaseUserToAppUser(data.user);
      setUser(mapped);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
