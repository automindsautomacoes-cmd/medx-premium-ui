import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateEventModal({ isOpen, onClose, selectedDate }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo Agendamento</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Input placeholder="Nome do paciente" />
          </div>
          <div className="space-y-2">
            <Label>Data/Hora</Label>
            <Input type="datetime-local" defaultValue={selectedDate?.toISOString().slice(0, 16)} />
          </div>
          <Button className="w-full">Criar Agendamento</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
