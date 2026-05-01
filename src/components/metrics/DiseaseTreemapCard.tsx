import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";

export function DiseaseTreemapCard() {
  const data = [
    {
      name: 'Cardiologia',
      children: [
        { name: 'Hipertensão', size: 450 },
        { name: 'Arritmia', size: 120 },
        { name: 'Insuficiência', size: 80 },
      ],
    },
    {
      name: 'Endocrinologia',
      children: [
        { name: 'Diabetes Tipo 2', size: 380 },
        { name: 'Hipotireoidismo', size: 210 },
        { name: 'Obesidade', size: 150 },
      ],
    },
    {
      name: 'Pediatria',
      children: [
        { name: 'Check-up', size: 300 },
        { name: 'Virose', size: 180 },
        { name: 'Alergia', size: 90 },
      ],
    },
  ];

  return (
    <Card className="bg-[#0a0a0a]/40 backdrop-blur-xl border-white/5 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Distribuição de Diagnósticos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#5227FF"
            >
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
