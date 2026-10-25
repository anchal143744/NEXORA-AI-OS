import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function ResponsiveGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>{children}</div>;
}

export function ResponsiveStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('flex flex-col gap-4 lg:flex-row lg:items-stretch', className)}>{children}</div>;
}
