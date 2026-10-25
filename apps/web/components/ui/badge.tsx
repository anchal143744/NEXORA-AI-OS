import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'border-gold-500/30 bg-gold-500/12 text-gold-100',
      neutral: 'border-white/10 bg-white/[0.07] text-graphite-200',
      success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
      warning: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
      info: 'border-primary-300/30 bg-primary-300/10 text-primary-100',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Badge({
  className,
  children,
  variant,
}: {
  className?: string;
  children: ReactNode;
} & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))}>{children}</span>;
}
