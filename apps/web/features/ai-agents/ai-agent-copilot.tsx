'use client';

import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { runAiAgentCommand } from '@/lib/agent-workspace';

const commands = ['Create a sales agent', 'Deploy an HR assistant', 'Show failing agents', 'Optimize workflows', 'Show automation savings', 'Recommend new automations'];

export function AiAgentCopilot() {
  const [command, setCommand] = useState(commands[0]);
  const [result, setResult] = useState(() => runAiAgentCommand(commands[0]));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>AI Agent Copilot</CardTitle>
            <p className="mt-2 text-sm text-graphite-400">Use plain business language to create, deploy, monitor and optimize agents.</p>
          </div>
          <Badge><Sparkles className="size-3" />OpenAI-inspired agent guidance</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={command} onChange={(event) => setCommand(event.target.value)} aria-label="AI Agent Copilot command" />
            <Button onClick={() => setResult(runAiAgentCommand(command))}><Send className="size-4" />Run</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {commands.map((item) => (
              <button key={item} type="button" onClick={() => { setCommand(item); setResult(runAiAgentCommand(item)); }} className="rounded-sm border border-white/10 bg-graphite-950/70 px-2 py-1 text-left text-xs text-graphite-300 transition hover:border-gold-300/50 hover:text-white">
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><Bot className="size-4 text-gold-200" />Copilot response</div>
          <p className="mt-3 text-sm leading-6 text-graphite-300">{result.response}</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {result.recommendedActions.map((action) => (
              <span key={action} className="rounded-sm border border-white/10 bg-white/[0.045] px-3 py-2 text-xs text-graphite-300">{action}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
