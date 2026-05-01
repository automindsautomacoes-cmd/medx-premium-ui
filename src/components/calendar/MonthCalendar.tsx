import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MonthCalendar({ appointments, onDayClick, onAppointmentClick }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysCount = lastDay.getDate();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysCount; i++) days.push(new Date(year, month, i));

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 flex-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground border-b">{d}</div>)}
        {days.map((date, i) => (
          <div key={i} className={cn("border-r border-b p-2 min-h-[100px] hover:bg-accent/50 transition-all cursor-pointer", !date && "bg-muted/10")} onClick={() => date && onDayClick?.(date)}>
            {date && <span className="text-sm font-medium">{date.getDate()}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
