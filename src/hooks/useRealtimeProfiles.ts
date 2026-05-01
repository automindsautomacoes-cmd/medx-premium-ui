import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useRealtimeProfiles(initialData: any[] = [], options: { filter?: string; channelName: string; onlyUpdates?: boolean }) {
  const [profiles, setProfiles] = useState<any[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const fetchInitial = async () => {
      setIsLoading(true);
      let query = supabase.from('profiles').select('*');
      if (options.filter) {
        const [col, op, val] = options.filter.split('.');
        if (op === 'eq') query = query.eq(col, val);
      }
      const { data } = await query;
      if (isMountedRef.current) setProfiles(data || []);
      setIsLoading(false);
    };
    fetchInitial();
    const channel = supabase.channel(options.channelName).on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
      fetchInitial();
    }).subscribe();
    return () => {
      isMountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [options.channelName, options.filter]);

  return { profiles, isLoading };
}
