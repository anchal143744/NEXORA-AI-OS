import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-md bg-white/[0.08] before:absolute before:inset-0 before:animate-shimmer before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]',
        className,
      )}
    />
  );
}
