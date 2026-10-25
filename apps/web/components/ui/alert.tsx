import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  info: {
    icon: Info,
    className: 'border-primary-300/25 bg-primary-300/10 text-primary-100',
  },
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100',
  },
  warning: {
    icon: TriangleAlert,
    className: 'border-amber-400/25 bg-amber-400/10 text-amber-100',
  },
  danger: {
    icon: AlertCircle,
    className: 'border-red-400/25 bg-red-400/10 text-red-100',
  },
} as const;

export function Alert({
  title,
  children,
  variant = 'info',
  className,
}: {
  title: string;
  children?: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  const tone = variants[variant];
  const Icon = tone.icon;

  return (
    <section className={cn('flex gap-3 rounded-lg border p-4 shadow-hairline', tone.className, className)} role={variant === 'danger' ? 'alert' : 'status'}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {children ? <div className="mt-1 text-sm leading-6 text-current/82">{children}</div> : null}
      </div>
    </section>
  );
}
