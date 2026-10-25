'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type TabItem = {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

export function Tabs({
  items,
  defaultValue,
  className,
}: {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}) {
  const initialValue = defaultValue ?? items.find((item) => !item.disabled)?.value ?? items[0]?.value;
  const [active, setActive] = useState(initialValue);
  const activeItem = useMemo(() => items.find((item) => item.value === active) ?? items[0], [active, items]);

  return (
    <div className={cn('space-y-4', className)}>
      <div role="tablist" aria-label="Tab group" className="inline-flex rounded-lg border border-white/10 bg-white/[0.06] p-1">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active === item.value}
            disabled={item.disabled}
            onClick={() => setActive(item.value)}
            className={cn(
              'h-9 rounded-md px-3 text-sm font-medium text-graphite-300 transition duration-200 focus-visible:premium-focus disabled:opacity-40',
              active === item.value && 'bg-gold-500 text-graphite-990 shadow-gold',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm text-graphite-300">
        {activeItem?.content}
      </div>
    </div>
  );
}
