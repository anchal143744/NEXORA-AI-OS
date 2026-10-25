import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingState({
  label = 'Loading',
  variant = 'spinner',
  className,
}: {
  label?: string;
  variant?: 'spinner' | 'pulse' | 'ai';
  className?: string;
}) {
  if (variant === 'pulse') {
    return <div className={cn('h-2 w-full overflow-hidden rounded-full bg-white/[0.08]', className)}><div className="h-full w-1/3 animate-pulse rounded-full bg-gold-500" /></div>;
  }

  return (
    <div className={cn('inline-flex items-center gap-2 text-sm text-graphite-300', className)} role="status" aria-label={label}>
      {variant === 'ai' ? <Sparkles className="size-4 animate-soft-pulse text-gold-300" /> : <Loader2 className="size-4 animate-spin text-gold-300" />}
      <span>{label}</span>
    </div>
  );
}
