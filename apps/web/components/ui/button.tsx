import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium tracking-normal transition duration-200 ease-premium focus-visible:premium-focus active:translate-y-px disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        default: 'bg-gold-500 text-graphite-990 shadow-gold hover:bg-gold-300',
        secondary: 'bg-primary-900 text-white shadow-subtle hover:bg-primary-700',
        subtle: 'border border-white/10 bg-white/[0.07] text-graphite-50 hover:border-white/15 hover:bg-white/[0.11]',
        outline: 'border border-gold-500/35 bg-transparent text-gold-100 hover:bg-gold-500/10',
        ghost: 'text-graphite-200 hover:bg-white/[0.08] hover:text-white',
        danger: 'bg-red-500/90 text-white hover:bg-red-400',
        gold: 'bg-gradient-to-b from-gold-300 to-gold-600 text-graphite-990 shadow-gold hover:from-gold-100 hover:to-gold-500',
        icon: 'text-graphite-200 hover:bg-white/[0.08] hover:text-white',
      },
      size: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-10 px-3.5',
        lg: 'h-11 px-4',
        xl: 'h-12 px-5 text-base',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
