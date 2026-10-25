import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PublicLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn('min-h-screen bg-graphite-990 text-graphite-50', className)}>
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
