import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export type ActivityItem = {
  id: string;
  title: string;
  description?: string;
  time: string;
};

export function ActivityCard({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-graphite-300">
              <Clock className="size-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-white">{item.title}</span>
              {item.description ? <span className="mt-1 block text-sm leading-6 text-graphite-400">{item.description}</span> : null}
              <span className="mt-1 block text-xs text-graphite-500">{item.time}</span>
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
