import { cn } from '@/lib/utils';
export function Panel({ className, children }: { className?: string; children: React.ReactNode }) { return <section className={cn('rounded-lg border border-neutral-200 bg-white/78 shadow-subtle backdrop-blur-shell', className)}>{children}</section>; }
