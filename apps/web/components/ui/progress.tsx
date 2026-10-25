import { cn } from '@/lib/utils';

export function Progress({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <div className="flex items-center justify-between text-xs text-graphite-400">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.08]" role="progressbar" aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-primary-300 shadow-gold transition-all duration-300 ease-premium" style={{ width: String(safeValue) + '%' }} />
      </div>
    </div>
  );
}
