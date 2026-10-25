'use client';

import { FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Command, Dock, Loader2, Maximize2, MessageSquare, Minimize2, PanelRightClose, Send, Sparkles, X } from 'lucide-react';
import { AiRecommendationList } from './ai-recommendations';
import { ExecutiveBriefingCard } from './executive-briefing';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-states';
import { Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motionTokens } from '@/lib/motion';
import { useAiContext } from '@/providers/ai-provider';
import { useShellStore } from '@/stores/shell-store';

export function PersistentAiCopilot() {
  const {
    messages,
    suggestedPrompts,
    recommendations,
    briefing,
    isThinking,
    briefingLoading,
    error,
    askCopilot,
    clearConversation,
    refreshExecutiveBriefing,
  } = useAiContext();
  const open = useShellStore((state) => state.copilotOpen);
  const minimized = useShellStore((state) => state.copilotMinimized);
  const mode = useShellStore((state) => state.copilotMode);
  const setOpen = useShellStore((state) => state.setCopilotOpen);
  const setMinimized = useShellStore((state) => state.setCopilotMinimized);
  const setMode = useShellStore((state) => state.setCopilotMode);
  const [input, setInput] = useState('');

  const assistantMessages = useMemo(() => messages.filter((message) => message.role !== 'system'), [messages]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || isThinking) return;
    setInput('');
    void askCopilot(prompt);
  }

  function askSuggested(prompt: string) {
    setOpen(true);
    setMinimized(false);
    void askCopilot(prompt);
  }

  if (!open || minimized) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 items-center gap-2 rounded-lg border border-gold-500/30 bg-gold-500 px-4 text-sm font-semibold text-graphite-990 shadow-gold transition hover:bg-gold-300 focus-visible:premium-focus"
        aria-label="Open NEXORA AI Copilot"
      >
        <Bot className="size-4" />
        <span className="hidden sm:inline">AI Copilot</span>
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.aside
        {...motionTokens.card}
        className={mode === 'docked' ? 'fixed inset-y-3 right-3 z-50 w-[min(460px,calc(100vw-1.5rem))] sm:inset-y-4 sm:right-4 sm:w-[min(460px,calc(100vw-2rem))]' : 'fixed bottom-3 left-3 right-3 z-50 sm:left-auto sm:right-5 sm:w-[min(440px,calc(100vw-2rem))]'}
        role="complementary"
        aria-label="Persistent AI Copilot"
      >
        <Card className={cn('flex flex-col overflow-hidden shadow-glow', mode === 'docked' ? 'h-full' : 'h-[min(640px,calc(100dvh-1.5rem))] sm:h-[min(680px,calc(100dvh-2.5rem))]')}>
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge>
                  <Sparkles className="size-3" />
                  Executive AI
                </Badge>
                <CardTitle className="mt-3 flex items-center gap-2 text-base">
                  <Bot className="size-4 text-gold-100" />
                  NEXORA Copilot
                </CardTitle>
                <p className="mt-1 text-xs leading-5 text-graphite-400">Workspace-aware assistant for decisions, workflows, reports and actions.</p>
              </div>
              <div className="flex gap-1">
                <Button variant="icon" size="icon" aria-label={mode === 'docked' ? 'Use floating mode' : 'Use docked mode'} onClick={() => setMode(mode === 'docked' ? 'floating' : 'docked')}>
                  {mode === 'docked' ? <Maximize2 className="size-4" /> : <Dock className="size-4" />}
                </Button>
                <Button variant="icon" size="icon" aria-label="Minimize AI Copilot" onClick={() => setMinimized(true)}>
                  <Minimize2 className="size-4" />
                </Button>
                <Button variant="icon" size="icon" aria-label="Close AI Copilot" onClick={() => setOpen(false)}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto p-4 scrollbar-luxury">
            {error ? <Alert title="AI request issue" variant="warning" className="mb-4">{error}</Alert> : null}
            <Tabs
              defaultValue="chat"
              items={[
                {
                  value: 'chat',
                  label: 'Chat',
                  content: (
                    <div className="space-y-4">
                      <SuggestedPrompts prompts={suggestedPrompts} onAsk={askSuggested} disabled={isThinking} />
                      <Conversation messages={assistantMessages} loading={isThinking} />
                    </div>
                  ),
                },
                {
                  value: 'briefing',
                  label: 'Briefing',
                  content: <ExecutiveBriefingCard briefing={briefing} loading={briefingLoading} onRefresh={() => void refreshExecutiveBriefing()} />,
                },
                {
                  value: 'Actions',
                  label: 'Actions',
                  content: <AiRecommendationList recommendations={recommendations} />,
                },
              ]}
            />
          </CardContent>

          <div className="border-t border-white/10 p-3 safe-bottom">
            <form onSubmit={submit} className="flex gap-2">
              <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask for a report, forecast, workflow or risk" aria-label="Ask NEXORA AI Copilot" disabled={isThinking} />
              <Button size="icon" aria-label="Send AI command" disabled={isThinking || !input.trim()}>
                {isThinking ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-graphite-500">
              <span className="inline-flex items-center gap-1">
                <Command className="size-3" />
                Ctrl K opens smart commands
              </span>
              <button type="button" className="text-graphite-400 underline-offset-4 hover:text-white hover:underline focus-visible:premium-focus" onClick={clearConversation}>
                Clear history
              </button>
            </div>
          </div>
        </Card>
      </motion.aside>
    </AnimatePresence>
  );
}

function SuggestedPrompts({ prompts, onAsk, disabled }: { prompts: string[]; onAsk: (prompt: string) => void; disabled: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.slice(0, 5).map((prompt) => (
        <Button key={prompt} variant="subtle" size="sm" onClick={() => onAsk(prompt)} disabled={disabled} className="max-w-full justify-start">
          <span className="truncate">{prompt}</span>
        </Button>
      ))}
    </div>
  );
}

function Conversation({ messages, loading }: { messages: ReturnType<typeof useAiContext>['messages']; loading: boolean }) {
  if (messages.length === 0 && !loading) {
    return (
      <EmptyState
        title="Ask the executive copilot"
        description="Try revenue forecasting, workflow creation, hiring guidance, reports or operational risk analysis."
        icon={MessageSquare}
        className="min-h-64"
      />
    );
  }

  return (
    <div className="space-y-3" aria-live="polite">
      {messages.map((message) => (
        <div key={message.id} className={message.role === 'user' ? 'ml-8 rounded-lg bg-gold-500 p-3 text-sm leading-6 text-graphite-990' : 'mr-8 rounded-lg border border-white/10 bg-white/[0.055] p-3 text-sm leading-6 text-graphite-200'}>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">{message.role === 'user' ? 'You' : 'NEXORA AI'}</div>
          <div className="whitespace-pre-wrap">{message.content}</div>
          {message.actions && message.actions.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.actions.map((action) => (
                <Button key={action.id} asChild={Boolean(action.href)} variant="outline" size="sm" disabled={action.status === 'restricted'}>
                  {action.href ? <a href={action.href}>{action.label}</a> : <span>{action.label}</span>}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
      {loading ? (
        <div className="rounded-lg border border-gold-500/20 bg-gold-500/10 p-3">
          <LoadingState variant="ai" label="NEXORA is reasoning over workspace context" />
        </div>
      ) : null}
    </div>
  );
}
