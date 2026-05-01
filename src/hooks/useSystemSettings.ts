import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SystemSetting {
  key: string;
  value: string;
}

interface UseSystemSettingsReturn {
  settings: Record<string, string>;
  loading: boolean;
  error: Error | null;
  refreshSettings: () => Promise<void>;
}

export const useSystemSettings = (key?: string): UseSystemSettingsReturn => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('system_settings')
        .select('key, value')
        .eq('is_active', true);

      if (key) {
        query = query.eq('key', key).single();
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (key && data && !Array.isArray(data)) {
        setSettings({ [data.key]: data.value });
      } else if (Array.isArray(data)) {
        const settingsObj = data.reduce((acc, item: SystemSetting) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as Record<string, string>);
        setSettings(settingsObj);
      } else {
        setSettings({});
      }
    } catch (err) {
      console.error('Erro ao buscar configurações do sistema:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const subscription = supabase
      .channel('system_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_settings',
        },
        (payload) => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [key]);

  return {
    settings,
    loading,
    error,
    refreshSettings: fetchSettings,
  };
};

export async function getSystemSetting(key: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return data.value;
  } catch (err) {
    return null;
  }
}

export async function getAllSystemSettings(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .eq('is_active', true);

    if (error || !data) {
      return {};
    }

    return data.reduce((acc, item: SystemSetting) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (err) {
    return {};
  }
}
