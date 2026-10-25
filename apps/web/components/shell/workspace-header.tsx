'use client';

import { Activity, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/providers/workspace-provider';

export function WorkspaceHeader() {
  const workspace = useWorkspace();

  return (
    <section className="mb-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.055] to-gold-500/[0.08] p-5 shadow-hairline backdrop-blur-shell">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral"><Building2 className="size-3" />{workspace.organizationName}</Badge>
            <Badge>{workspace.industry}</Badge>
            <Badge variant="success"><ShieldCheck className="size-3" />Secure organization access</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-normal text-white md:text-3xl">Adaptive Business Command Center</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite-300">
            Run the business from one guided workspace with the right modules, insights, actions and AI assistance for your role.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><Activity className="size-4" />Review activity</Button>
          <Button><Sparkles className="size-4" />Ask NEXORA AI</Button>
        </div>
      </div>
    </section>
  );
}
