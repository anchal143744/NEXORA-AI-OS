import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid = false, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-10 w-full rounded-md border bg-white/[0.07] px-3 text-sm text-graphite-50 outline-none transition duration-200 placeholder:text-graphite-400 focus:border-gold-500/70 focus:bg-white/[0.10] focus:ring-2 focus:ring-gold-500/20',
        invalid ? 'border-red-400/70 focus:border-red-300 focus:ring-red-400/20' : 'border-white/10',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
