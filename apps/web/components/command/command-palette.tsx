'use client';

import { Command } from 'cmdk';
import { Bot, Compass, Play, Search, Sparkles } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { getSmartCommandItems } from '@/features/ai/ai-command-registry';
import { useAiContext } from '@/providers/ai-provider';
import { useWorkspace } from '@/providers/workspace-provider';
import { searchDomains, searchWorkspace, type SearchResult } from '@/services/search-service';
import { useShellStore } from '@/stores/shell-store';
import type { SmartCommandItem } from '@/types/ai-copilot';

export function CommandPalette() {
  const open = useShellStore((state) => state.commandOpen);
  const setOpen = useShellStore((state) => state.setCommandOpen);
  const setCopilotOpen = useShellStore((state) => state.setCopilotOpen);
  const setCopilotMinimized = useShellStore((state) => state.setCopilotMinimized);
  const { activeWorkspaceContext, askCopilot } = useAiContext();
  const workspace = useWorkspace();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const commands = useMemo(() => (activeWorkspaceContext ? getSmartCommandItems(activeWorkspaceContext) : []), [activeWorkspaceContext]);
  const grouped = useMemo(() => groupCommands(commands), [commands]);
  const searchResults = useMemo(() => (query.trim() ? searchWorkspace({ query, domains: searchDomains }, workspace).slice(0, 6) : []), [query, workspace]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!open);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  function runCommand(item: SmartCommandItem) {
    if (item.type === 'navigation' && item.href) {
      router.push(item.href as Route);
      setOpen(false);
      return;
    }

    setCopilotOpen(true);
    setCopilotMinimized(false);
    void askCopilot(item.prompt ?? item.label);
    setOpen(false);
  }

  function openSearchResult(result: SearchResult) {
    router.push(result.href as Route);
    setQuery('');
    setOpen(false);
  }

  function askFreeform() {
    const prompt = query.trim();
    if (!prompt) return;
    setCopilotOpen(true);
    setCopilotMinimized(false);
    void askCopilot(prompt);
    setQuery('');
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-graphite-990/70 px-4 pt-[max(5rem,12vh)] backdrop-blur-md" onMouseDown={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Command palette">
      <Command onMouseDown={(event) => event.stopPropagation()} className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-graphite-950 shadow-glow">
        <div className="flex items-center border-b border-white/10 px-4">
          <Search className="size-4 text-graphite-500" />
          <Command.Input value={query} onValueChange={setQuery} className="h-14 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-graphite-500" placeholder="Navigate, search, run actions, ask AI" aria-label="Search commands and business entities" />
          <Badge variant="neutral">Ctrl K</Badge>
        </div>
        <Command.List className="max-h-[min(24rem,58vh)] overflow-auto p-2 scrollbar-luxury">
          <Command.Empty className="p-4 text-sm text-graphite-500">No exact command found. Press Enter on Ask AI to send this to the copilot.</Command.Empty>
          {query.trim() ? (
            <Command.Item value={'ask-ai-' + query} onSelect={askFreeform} className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gold-100 aria-selected:bg-gold-500/12">
              <Sparkles className="size-4" />
              <span className="truncate">Ask AI: {query}</span>
            </Command.Item>
          ) : null}
          {searchResults.length ? (
            <Command.Group heading="Universal Search" className="text-xs text-graphite-500 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
              {searchResults.map((result) => (
                <Command.Item key={result.id} value={result.title + ' ' + result.summary + ' ' + result.domain} onSelect={() => openSearchResult(result)} className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm text-graphite-200 aria-selected:bg-gold-500/12 aria-selected:text-gold-100">
                  <Search className="size-4" />
                  <span className="min-w-0">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate">{result.title}</span>
                      <Badge variant="neutral">{result.domain}</Badge>
                    </span>
                    {result.summary ? <span className="block truncate text-xs text-graphite-500">{result.summary}</span> : null}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          ) : null}
          {Object.entries(grouped).map(([heading, items]) => (
            <Command.Group key={heading} heading={heading} className="text-xs text-graphite-500 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
              {items.map((item) => {
                const Icon = item.type === 'navigation' ? Compass : item.type === 'action' ? Play : Bot;
                return (
                  <Command.Item key={item.id} value={item.label + ' ' + item.description} onSelect={() => runCommand(item)} className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm text-graphite-200 aria-selected:bg-gold-500/12 aria-selected:text-gold-100">
                    <Icon className="size-4" />
                    <span className="min-w-0">
                      <span className="block truncate">{item.label}</span>
                      <span className="block truncate text-xs text-graphite-500">{item.description}</span>
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}

function groupCommands(items: SmartCommandItem[]) {
  return items.reduce<Record<string, SmartCommandItem[]>>((groups, item) => {
    const heading = item.type === 'navigation' ? 'Navigation' : item.type === 'action' ? 'AI Actions' : 'AI Commands';
    groups[heading] = [...(groups[heading] ?? []), item];
    return groups;
  }, {});
}
