import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ErrorState({
  title = 'Something needs attention',
  description,
  actionLabel,
  onAction,
  action,
  className,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-lg border border-red-400/20 bg-red-400/10 p-5 text-red-50 shadow-hairline', className)} role="alert">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {description ? <p className="mt-1 text-sm leading-6 text-red-100/82">{description}</p> : null}
          {action ?? (actionLabel && onAction ? <Button className="mt-4" variant="outline" onClick={onAction}>{actionLabel}</Button> : null)}
        </div>
      </div>
    </section>
  );
}
