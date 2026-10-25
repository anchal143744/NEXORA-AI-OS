'use client';

import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { searchDomains, searchWorkspace, type SearchResult } from '@/services/search-service';
import { useWorkspace } from '@/providers/workspace-provider';
import { cn } from '@/lib/utils';

export const searchableResources = ['Modules', 'Pages', 'Customers', 'Projects', 'Tasks', 'Invoices', 'Employees', 'Reports', 'AI Agents', 'Recent items'] as const;

export function GlobalSearch() {
  const router = useRouter();
  const workspace = useWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const results = useMemo(() => searchWorkspace({ query, domains: searchDomains }, workspace).slice(0, 8), [query, workspace]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function openResult(result: SearchResult) {
    router.push(result.href as Route);
    setQuery('');
    setOpen(false);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) openResult(results[0]);
  }

  return (
    <form className="relative min-w-0 flex-1 md:max-w-2xl" role="search" onSubmit={submitSearch}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-graphite-500" />
      <Input
        ref={inputRef}
        aria-label="Search across NEXORA"
        aria-expanded={open}
        aria-controls="global-search-results"
        className="h-10 pl-9 pr-20"
        placeholder="Search modules, customers, invoices, reports"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-sm border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-xs text-graphite-500 md:block">
        /
      </span>
      {open ? (
        <div id="global-search-results" className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-xl border border-white/10 bg-graphite-950 shadow-glow" role="listbox" aria-label="Search results">
          <div className="border-b border-white/10 px-3 py-2 text-xs text-graphite-500">
            {query.trim() ? 'Best matches in this workspace' : 'Recent and recommended'}
          </div>
          <div className="max-h-96 overflow-auto p-2 scrollbar-luxury">
            {results.length ? results.map((result) => (
              <button
                key={result.id}
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => openResult(result)}
                className={cn('flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition hover:bg-white/[0.08] focus-visible:premium-focus')}
              >
                <Search className="mt-0.5 size-4 shrink-0 text-gold-200" />
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-medium text-graphite-100">{result.title}</span>
                    <Badge variant="neutral">{result.domain}</Badge>
                  </span>
                  {result.summary ? <span className="mt-1 block truncate text-xs text-graphite-500">{result.summary}</span> : null}
                </span>
              </button>
            )) : (
              <div className="px-3 py-6 text-center text-sm text-graphite-500">No results found. Press Ctrl K to ask NEXORA AI.</div>
            )}
          </div>
        </div>
      ) : null}
    </form>
  );
}
