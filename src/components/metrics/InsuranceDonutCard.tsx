import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export function InsuranceDonutCard() {
  const data = [
    { name: 'Unimed', value: 40, color: '#00FFFF' },
    { name: 'Bradesco', value: 30, color: '#5227FF' },
    { name: 'SulAmérica', value: 15, color: '#FF00FF' },
    { name: 'Particular', value: 15, color: '#FFFFFF' },
  ];

  return (
    <Card className="bg-[#0a0a0a]/40 backdrop-blur-xl border-white/5 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Convênios vs Particular</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
