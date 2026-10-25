import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('grid min-h-56 place-items-center rounded-lg border border-dashed border-white/12 bg-white/[0.035] p-8 text-center', className)}>
      <div className="max-w-sm">
        <div className="mx-auto grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.07] text-gold-100">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-6 text-graphite-400">{description}</p> : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </section>
  );
}
