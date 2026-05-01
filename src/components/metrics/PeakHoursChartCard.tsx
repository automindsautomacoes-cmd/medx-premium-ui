import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

export function PeakHoursChartCard() {
  const { loading } = useDashboardMetrics();

  // Dados Mock para visualização se loading
  const data = [
    { hour: '08h', appointments: 12 },
    { hour: '09h', appointments: 25 },
    { hour: '10h', appointments: 38 },
    { hour: '11h', appointments: 30 },
    { hour: '12h', appointments: 15 },
    { hour: '13h', appointments: 18 },
    { hour: '14h', appointments: 42 },
    { hour: '15h', appointments: 35 },
    { hour: '16h', appointments: 28 },
    { hour: '17h', appointments: 20 },
    { hour: '18h', appointments: 10 },
  ];

  return (
    <Card className="bg-[#0a0a0a]/40 backdrop-blur-xl border-white/5 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Pico de Atendimentos
          <span className="text-xs font-normal text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">Por Horário</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#00FFFF' }}
              />
              <Bar 
                dataKey="appointments" 
                fill="url(#colorBar)" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FFFF" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#00FFFF" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
