import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface DoctorScheduleDB {
  id?: string;
  doctor_id: string;
  appointment_duration: number;
  seg_inicio?: string;
  seg_pausa_inicio?: string;
  seg_pausa_fim?: string;
  seg_fim?: string;
  seg_ativo?: boolean;
  ter_inicio?: string;
  ter_pausa_inicio?: string;
  ter_pausa_fim?: string;
  ter_fim?: string;
  ter_ativo?: boolean;
  qua_inicio?: string;
  qua_pausa_inicio?: string;
  qua_pausa_fim?: string;
  qua_fim?: string;
  qua_ativo?: boolean;
  qui_inicio?: string;
  qui_pausa_inicio?: string;
  qui_pausa_fim?: string;
  qui_fim?: string;
  qui_ativo?: boolean;
  sex_inicio?: string;
  sex_pausa_inicio?: string;
  sex_pausa_fim?: string;
  sex_fim?: string;
  sex_ativo?: boolean;
  sab_inicio?: string;
  sab_pausa_inicio?: string;
  sab_pausa_fim?: string;
  sab_fim?: string;
  sab_ativo?: boolean;
  dom_inicio?: string;
  dom_pausa_inicio?: string;
  dom_pausa_fim?: string;
  dom_fim?: string;
  dom_ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DoctorSchedule {
  id?: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  appointment_duration: number;
  break_start_time?: string;
  break_end_time?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const DAY_PREFIXES: Record<number, string> = {
  0: 'dom', 1: 'seg', 2: 'ter', 3: 'qua', 4: 'qui', 5: 'sex', 6: 'sab',
};

function dbToSchedules(dbData: DoctorScheduleDB | null): DoctorSchedule[] {
  if (!dbData) return [];
  const schedules: DoctorSchedule[] = [];
  for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
    const prefix = DAY_PREFIXES[dayOfWeek];
    schedules.push({
      id: dbData.id,
      doctor_id: dbData.doctor_id,
      day_of_week: dayOfWeek,
      start_time: (dbData as any)[`${prefix}_inicio`] || '08:00',
      end_time: (dbData as any)[`${prefix}_fim`] || '18:00',
      appointment_duration: dbData.appointment_duration || 30,
      break_start_time: (dbData as any)[`${prefix}_pausa_inicio`] || undefined,
      break_end_time: (dbData as any)[`${prefix}_pausa_fim`] || undefined,
      is_active: (dbData as any)[`${prefix}_ativo`] || false,
      created_at: dbData.created_at,
      updated_at: dbData.updated_at,
    });
  }
  return schedules;
}

function schedulesToDb(schedules: Record<number, DoctorSchedule>, doctorId: string): Partial<DoctorScheduleDB> {
  const dbData: Partial<DoctorScheduleDB> = {
    doctor_id: doctorId,
    appointment_duration: schedules[0]?.appointment_duration || 30,
  };
  Object.entries(schedules).forEach(([dayOfWeek, schedule]) => {
    const prefix = DAY_PREFIXES[parseInt(dayOfWeek)];
    (dbData as any)[`${prefix}_inicio`] = schedule.start_time || null;
    (dbData as any)[`${prefix}_pausa_inicio`] = schedule.break_start_time || null;
    (dbData as any)[`${prefix}_pausa_fim`] = schedule.break_end_time || null;
    (dbData as any)[`${prefix}_fim`] = schedule.end_time || null;
    (dbData as any)[`${prefix}_ativo`] = schedule.is_active || false;
  });
  return dbData;
}

export function useDoctorSchedule(doctorId: string) {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase.from('doctor_schedules').select('*').eq('doctor_id', doctorId).maybeSingle();
      if (fetchError) throw fetchError;
      setSchedules(dbToSchedules(data));
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar horários');
    } finally {
      setLoading(false);
    }
  };

  const saveAllSchedules = async (schedulesMap: Record<number, DoctorSchedule>) => {
    setLoading(true);
    try {
      const dbData = schedulesToDb(schedulesMap, doctorId);
      const { error: upsertError } = await supabase.from('doctor_schedules').upsert(dbData, { onConflict: 'doctor_id' });
      if (upsertError) throw upsertError;
      await fetchSchedules();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar horários');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) fetchSchedules();
  }, [doctorId]);

  return { schedules, loading, error, fetchSchedules, saveAllSchedules };
}
