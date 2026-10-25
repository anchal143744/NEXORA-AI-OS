'use client';

import { useState, type FormEvent } from 'react';
import { Bot, Brain, CheckCircle2, MessageSquareText, RotateCcw, Send, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-states';
import { ExecutiveBriefingCard } from '@/features/ai/executive-briefing';
import { useAiProviders } from '@/hooks/use-ai-v1';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { useAiContext } from '@/providers/ai-provider';
import { useWorkspace } from '@/providers/workspace-provider';
import { useAuthStore } from '@/stores/auth-store';
import type { AiProviderStatus } from '@/types/ai-v1';

export function V1AiWorkspace() {
  const workspace = useWorkspace();
  const ai = useAiContext();
  const providers = useAiProviders();
  const hydrated = useAuthStore((state) => state.hydrated);
  const authStatus = useAuthStore((state) => state.status);
  const [prompt, setPrompt] = useState('Summarize my current workspace risks and next actions');
  const configuredProviders = providers.data?.filter((provider) => provider.configured) ?? [];
  const isSessionLoading = !hydrated || (hydrated && authStatus === 'unknown');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPrompt = prompt.trim();
    if (!nextPrompt || ai.isThinking) return;
    await ai.askCopilot(nextPrompt);
  }

  return (
    <EnterpriseShell>
      <div className="space-y-5">
        <section className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-gold-500/[0.08] p-5 shadow-hairline">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <Badge>
                <Bot className="size-3" />
                V1 AI Copilot
              </Badge>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Ask NEXORA against your authorized business context.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">
                AI requests use the backend context builder, RBAC guard and workspace boundary. Provider-unavailable responses are shown clearly and never replaced with fabricated answers.
              </p>
            </div>
            <Badge variant="success">
              <ShieldCheck className="size-3" />
              Tenant scoped
            </Badge>
          </div>
        </section>

        {isSessionLoading ? (
          <Card>
            <CardContent className="pt-5">
              <LoadingState variant="ai" label="Restoring authenticated AI session" />
            </CardContent>
          </Card>
        ) : null}

        {hydrated && authStatus === 'anonymous' ? (
          <ErrorState title="Sign in required" description="AI context is protected workspace data. Sign in before opening this V1 module." />
        ) : null}

        {providers.isLoading ? (
          <Card>
            <CardContent className="pt-5">
              <LoadingState variant="ai" label="Checking AI provider configuration" />
            </CardContent>
          </Card>
        ) : null}

        {providers.isError ? (
          <ErrorState
            title="AI provider status could not load"
            description={providers.error.message}
            actionLabel="Retry provider check"
            onAction={() => void providers.refetch()}
          />
        ) : null}

        {providers.data ? (
          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <ProviderPanel providers={providers.data} configuredCount={configuredProviders.length} />
            <ContextPanel workspaceName={workspace.workspaceName} organizationName={workspace.organizationName} industry={workspace.industry} modules={workspace.modules.filter((module) => module.enabled).map((module) => module.label)} />
          </div>
        ) : null}

        {providers.data && configuredProviders.length === 0 ? (
          <Alert title="AI provider unavailable" variant="warning">
            No live model provider is configured for this environment. The backend will return a provider-unavailable response instead of a fabricated AI answer.
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="size-4 text-gold-100" />
              Executive copilot
            </CardTitle>
            <CardDescription>Send a real backend AI request using the current workspace context.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3 lg:flex-row" onSubmit={submit}>
              <Input value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="AI prompt" disabled={ai.isThinking} />
              <Button type="submit" disabled={ai.isThinking || !prompt.trim()}>
                {ai.isThinking ? <RotateCcw className="size-4 animate-spin" /> : <Send className="size-4" />}
                {ai.isThinking ? 'Asking AI' : 'Ask AI'}
              </Button>
            </form>
            {ai.error ? <p className="mt-3 text-sm text-red-200">{ai.error}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {ai.suggestedPrompts.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-left text-xs text-graphite-300 transition hover:border-gold-500/35 hover:text-gold-100"
                  disabled={ai.isThinking}
                  onClick={() => setPrompt(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {ai.messages.length === 0 ? (
          <EmptyState
            title="No AI conversation yet"
            description="Ask a question to create a persisted backend AI conversation. If the provider is not configured, NEXORA will say so clearly."
            icon={Brain}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Conversation history</CardTitle>
              <CardDescription>Stored locally for continuity and backed by the API when messages are submitted.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {ai.messages.slice(-8).map((message) => (
                <article key={message.id} className={'rounded-lg border p-4 ' + (message.role === 'assistant' ? 'border-gold-500/20 bg-gold-500/[0.08]' : 'border-white/10 bg-white/[0.045]')}>
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant={message.role === 'assistant' ? 'success' : 'neutral'}>{message.role === 'assistant' ? 'NEXORA AI' : 'You'}</Badge>
                    <span className="text-xs text-graphite-500">{message.createdAt.slice(0, 19).replace('T', ' ')}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-graphite-200">{message.content}</p>
                </article>
              ))}
            </CardContent>
          </Card>
        )}

        <ExecutiveBriefingCard briefing={ai.briefing} loading={ai.briefingLoading} onRefresh={() => void ai.refreshExecutiveBriefing()} />
      </div>
    </EnterpriseShell>
  );
}

function ProviderPanel({ providers, configuredCount }: { providers: AiProviderStatus[]; configuredCount: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-gold-100" />
          Provider status
        </CardTitle>
        <CardDescription>{configuredCount} provider{configuredCount === 1 ? '' : 's'} configured in this environment.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {providers.map((provider) => (
          <div key={provider.key} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="text-sm text-white">{provider.name}</span>
            <Badge variant={provider.configured ? 'success' : 'neutral'}>
              {provider.configured ? <CheckCircle2 className="size-3" /> : <TriangleAlert className="size-3" />}
              {provider.configured ? 'Configured' : 'Unavailable'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ContextPanel({ workspaceName, organizationName, industry, modules }: { workspaceName: string; organizationName: string; industry: string; modules: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorized context</CardTitle>
        <CardDescription>Sent to the backend AI context builder from the current workspace state.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ContextRow label="Organization" value={organizationName} />
        <ContextRow label="Workspace" value={workspaceName} />
        <ContextRow label="Industry" value={industry} />
        <div className="flex flex-wrap gap-2">
          {modules.slice(0, 8).map((module) => <Badge key={module} variant="neutral">{module}</Badge>)}
        </div>
      </CardContent>
    </Card>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
      <span className="text-graphite-400">{label}</span>
      <span className="truncate font-medium text-white">{value}</span>
    </div>
  );
}
