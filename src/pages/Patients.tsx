import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MagicBentoCard } from '@/components/bento/MagicBento';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRealtimeList } from '@/hooks/useRealtimeList';
import { Search, Plus, UserPlus } from 'lucide-react';

export default function Patients() {
  const { data: patients, loading } = useRealtimeList({ table: 'patients' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <Button><Plus className="mr-2 h-4 w-4" /> Novo Paciente</Button>
        </div>
        <MagicBentoCard>
          <div className="flex items-center gap-2 p-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input placeholder="Buscar pacientes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0 shadow-none" />
          </div>
        </MagicBentoCard>
        <MagicBentoCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient: any) => (
                <TableRow key={patient.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar><AvatarFallback>{patient.name[0]}</AvatarFallback></Avatar>
                    <span className="font-medium">{patient.name}</span>
                  </TableCell>
                  <TableCell>{patient.email || patient.phone || '-'}</TableCell>
                  <TableCell className="text-right"><Button variant="outline" size="sm">Detalhes</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </MagicBentoCard>
      </div>
    </DashboardLayout>
  );
}
