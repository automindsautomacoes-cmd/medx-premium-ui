import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MagicBentoGrid, MagicBentoCard } from '@/components/bento/MagicBento';
import { Users, Calendar, Activity, Stethoscope } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { PeakHoursChartCard } from '@/components/metrics/PeakHoursChartCard';
import { WeekdayChartCard } from '@/components/metrics/WeekdayChartCard';
import { DoctorPieChartCard } from '@/components/metrics/DoctorPieChartCard';
import { InsuranceDonutCard } from '@/components/metrics/InsuranceDonutCard';
import { DiseaseTreemapCard } from '@/components/metrics/DiseaseTreemapCard';

export default function Dashboard() {
  const metrics = useDashboardMetrics();

  const stats = [
    {
      title: 'Consultas Hoje',
      value: String(metrics.consultasHoje),
      icon: Calendar,
      trend: metrics.calculateTrend(metrics.consultasMesAtual, metrics.consultasMesAnterior),
      description: 'vs. mês passado'
    },
    {
      title: 'Pacientes CRM',
      value: String(metrics.pacientesCRM),
      icon: Users,
      trend: metrics.calculateTrend(metrics.pacientesCRMMesAtual, metrics.pacientesCRMMesAnterior),
      description: 'novos este mês'
    },
    {
      title: 'Pré Pacientes',
      value: String(metrics.prePatientes),
      icon: Activity,
      trend: '—',
      description: 'aguardando conversão'
    },
    {
      title: 'Equipe Médica',
      value: String(metrics.totalMedicos),
      icon: Stethoscope,
      trend: metrics.totalSecretarias > 0 ? `+${metrics.totalSecretarias} sec.` : '—',
      description: 'médicos ativos'
    },
  ];

  return (
    <DashboardLayout requiredRoles={['owner']}>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="animate-reveal" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
            Métricas de Atendimento
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Visão analítica do desempenho clínico em tempo real</p>
        </div>

        {/* Stats Grid - Magic Bento */}
        <MagicBentoGrid>
          {stats.map((stat, index) => (
            <MagicBentoCard 
              key={index} 
              accent={index % 2 === 0 ? 'primary' : 'accent'}
              delay={0.2 + (index * 0.1)}
            >
              <div className="flex items-start justify-between pb-4">
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">{stat.title}</div>
                <div className="p-2 rounded-xl bg-primary/5 border border-primary/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-4xl font-bold text-foreground tracking-tighter">
                {metrics.loading ? '...' : stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  String(stat.trend).startsWith('+') 
                    ? 'bg-green-500/10 text-green-400' 
                    : String(stat.trend).startsWith('-') 
                    ? 'bg-red-500/10 text-red-400' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stat.trend}
                </span>
                <span className="opacity-60">{stat.description}</span>
              </p>
            </MagicBentoCard>
          ))}
        </MagicBentoGrid>

        {/* Charts Grid - Linha 1: Gráficos de Tempo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-reveal" style={{ animationDelay: '0.6s' }}>
          <PeakHoursChartCard />
          <WeekdayChartCard />
        </div>

        {/* Charts Grid - Linha 2: Gráficos de Pizza */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-reveal" style={{ animationDelay: '0.7s' }}>
          <DoctorPieChartCard />
          <InsuranceDonutCard />
        </div>

        {/* Charts Grid - Linha 3: Gráfico de Diagnósticos */}
        <div className="grid grid-cols-1 gap-8 animate-reveal" style={{ animationDelay: '0.8s' }}>
          <DiseaseTreemapCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
