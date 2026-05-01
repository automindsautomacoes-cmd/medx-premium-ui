import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function WeekdayChartCard() {
  const data = [
    { day: 'Seg', appointments: 45 },
    { day: 'Ter', appointments: 52 },
    { day: 'Qua', appointments: 48 },
    { day: 'Qui', appointments: 61 },
    { day: 'Sex', appointments: 55 },
    { day: 'Sáb', appointments: 22 },
  ];

  return (
    <Card className="bg-[#0a0a0a]/40 backdrop-blur-xl border-white/5 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Volume Semanal
          <span className="text-xs font-normal text-muted-foreground bg-accent/10 px-2 py-0.5 rounded-full">Distribuição</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="day" 
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
              />
              <Area 
                type="monotone" 
                dataKey="appointments" 
                stroke="#5227FF" 
                strokeWidth={3}
                fill="url(#colorArea)" 
              />
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5227FF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#5227FF" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
