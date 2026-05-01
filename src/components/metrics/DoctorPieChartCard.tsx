import { Stethoscope, TrendingUp, Award, Users } from 'lucide-react';
import { MagicBentoCard } from '@/components/bento/MagicBento';
import { useRealtimeList } from '@/hooks/useRealtimeList';
import { useRealtimeProfiles } from '@/hooks/useRealtimeProfiles';
import { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function DoctorPieChartCard() {
  const { data: appointments } = useRealtimeList({ table: 'appointments' });
  const { data: medicalRecords } = useRealtimeList({ table: 'medical_records' });
  const { profiles } = useRealtimeProfiles([], { channelName: 'doctor-pie-chart-profiles', filter: 'role.eq.doctor' });

  const doctorStats = useMemo(() => {
    const doctorCounts: Record<string, number> = {};
    appointments.forEach((apt: any) => { if (apt.doctor_id) doctorCounts[apt.doctor_id] = (doctorCounts[apt.doctor_id] || 0) + 1; });
    medicalRecords.forEach((record: any) => { if (record.doctor_id) doctorCounts[record.doctor_id] = (doctorCounts[record.doctor_id] || 0) + 1; });
    const doctors = profiles.filter((p) => p.role === 'doctor');
    const total = (appointments.length + medicalRecords.length) || 1;
    return doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name || 'Médico',
      value: doctorCounts[doctor.id] || 0,
      percentage: ((doctorCounts[doctor.id] || 0) / total * 100).toFixed(1),
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
  }, [appointments, medicalRecords, profiles]);

  const COLORS = ['#5227FF', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];

  return (
    <MagicBentoCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">Ranking de Profissionais</span>
          </div>
        </div>
        {doctorStats.length > 0 ? (
          <div className="space-y-4">
            {doctorStats.slice(0, 3).map((doctor, index) => (
              <div key={doctor.id} className="p-4 rounded-xl border border-white/5 bg-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{doctor.name}</span>
                  <span className="text-primary font-bold">{doctor.value}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${doctor.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : <div className="text-center py-8 text-muted-foreground">Nenhum dado disponível</div>}
      </div>
    </MagicBentoCard>
  );
}
