'use client';

import { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRunHrCommand } from '@/hooks/use-people-workspace-actions';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';

const commands = ['Show employees on leave', 'Show attendance trends', 'Recommend promotion candidates', 'Show hiring pipeline', 'Identify skill gaps', 'Suggest training programs'];

export function AiHrCopilot() {
  const [text, setText] = useState('Show employees on leave');
  const runCommand = useRunHrCommand();
  const history = usePeopleWorkspaceStore((state) => state.commands);
  const submit = (command: string) => {
    const next = command.trim();
    if (next) runCommand.mutate(next);
  };

  return (
    <Card>
      <CardHeader>
        <Badge><Bot className="size-3" />AI HR Copilot</Badge>
        <CardTitle className="mt-2">Ask people questions in plain language.</CardTitle>
        <CardDescription>Copilot answers leave, attendance, promotion, hiring, skills and training questions with simple next actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 lg:flex-row">
          <Input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit(text); }} placeholder="Ask: Identify skill gaps" />
          <Button onClick={() => submit(text)} disabled={runCommand.isPending}><Sparkles className="size-4" />Run command</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {commands.map((command) => (
            <button key={command} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-graphite-300 transition hover:border-gold-500/35 hover:text-gold-100" onClick={() => { setText(command); submit(command); }}>
              {command}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-graphite-300">Run a command to see simple HR guidance and recommended actions.</div>
          ) : history.map((item) => (
            <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="text-sm font-semibold text-white">{item.command}</div>
              <p className="mt-2 text-sm leading-6 text-graphite-300">{item.response}</p>
              <div className="mt-3 flex flex-wrap gap-2">{item.recommendedActions.map((action) => <Badge key={action} variant="neutral">{action}</Badge>)}</div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
