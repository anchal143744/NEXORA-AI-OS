'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const labelOverrides: Record<string, string> = {
  crm: 'CRM',
  hr: 'People',
  ai: 'AI',
  'ai-agents': 'AI Agents',
};

function humanize(segment: string) {
  return labelOverrides[segment] ?? segment.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((segment, index) => ({
    label: humanize(segment),
    href: ('/' + segments.slice(0, index + 1).join('/')) as Route,
  }));

  return (
    <nav aria-label="Breadcrumb" className={cn('flex min-w-0 items-center gap-1 text-sm text-graphite-400', className)}>
      <Link href="/" className="inline-flex items-center gap-1 rounded-sm px-1.5 py-1 transition hover:text-white focus-visible:premium-focus">
        <Home className="size-3.5" />
        <span className="sr-only">Home</span>
      </Link>
      {crumbs.map((crumb, index) => {
        const current = index === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="size-3.5 shrink-0 text-graphite-600" />
            {current ? (
              <span aria-current="page" className="truncate text-graphite-200">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="truncate rounded-sm px-1.5 py-1 transition hover:text-white focus-visible:premium-focus">{crumb.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
