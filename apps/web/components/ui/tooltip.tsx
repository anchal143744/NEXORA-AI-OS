'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Tooltip({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-40 w-max max-w-56 -translate-x-1/2 rounded-md border border-white/10 bg-graphite-950 px-2.5 py-1.5 text-xs text-graphite-100 opacity-0 shadow-glow transition group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
