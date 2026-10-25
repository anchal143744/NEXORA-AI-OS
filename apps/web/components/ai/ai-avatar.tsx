import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AiAvatar({ label = 'AI', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('grid size-9 shrink-0 place-items-center rounded-lg border border-gold-500/30 bg-gold-500/14 text-gold-100 shadow-hairline', className)} aria-label={label}>
      <Bot className="size-4" aria-hidden="true" />
    </div>
  );
}
