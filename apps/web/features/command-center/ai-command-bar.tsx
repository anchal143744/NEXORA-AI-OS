'use client';

import { FormEvent, useState } from 'react';
import { Bot, Command, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRunAiCommand } from '@/hooks/use-command-center-actions';
import { useCommandCenterStore } from '@/stores/command-center-store';

export function AiCommandBar() {
  const [value, setValue] = useState('Show launch risks and create next actions');
  const runCommand = useRunAiCommand();
  const commands = useCommandCenterStore((state) => state.commands);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) return;
    runCommand.mutate(value);
    setValue('');
  }

  return (
    <Card className="border-gold-500/20 bg-gold-500/10">
      <CardContent className="space-y-4 p-4">
        <form onSubmit={submit} className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-graphite-950/70 px-3">
            <Command className="size-4 text-gold-300" />
            <Input aria-label="AI command" className="border-0 bg-transparent focus:ring-0" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Ask NEXORA to launch, analyze, search or orchestrate" />
          </div>
          <Button type="submit" disabled={runCommand.isPending}><Send className="size-4" />Run command</Button>
        </form>
        {commands.length ? (
          <div className="grid gap-2">
            {commands.map((command) => (
              <div key={command.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-3 text-sm text-graphite-300">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-white"><Bot className="size-4 text-gold-300" />{command.text}</span>
                  <Badge variant="neutral">{command.category}</Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-graphite-400">{command.result}</p>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
