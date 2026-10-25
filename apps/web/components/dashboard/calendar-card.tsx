import { CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function CalendarCard({
  title,
  time,
  location,
}: {
  title: string;
  time: string;
  location?: string;
}) {
  return (
    <Card>
      <CardContent className="flex gap-3 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-primary-300/20 bg-primary-300/10 text-primary-100">
          <CalendarDays className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-white">{title}</span>
          <span className="mt-1 block text-sm text-graphite-400">{time}</span>
          {location ? <span className="mt-1 block text-xs text-graphite-500">{location}</span> : null}
        </span>
      </CardContent>
    </Card>
  );
}
