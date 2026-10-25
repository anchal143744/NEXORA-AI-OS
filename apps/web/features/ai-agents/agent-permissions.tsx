'use client';

import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { permissions } from '@/lib/agent-workspace';

export function AgentPermissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Permissions</CardTitle>
        <p className="text-sm text-graphite-400">Workspace access, module access, data access and approval policies for every agent.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-2">
        {permissions.map((policy) => (
          <article key={policy.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck className="size-4 text-gold-200" />{policy.agentName}</div>
            <div className="mt-4 grid gap-3 text-sm text-graphite-300 md:grid-cols-2">
              <p><span className="text-graphite-500">Workspace</span><br />{policy.workspaceAccess}</p>
              <p><span className="text-graphite-500">Data</span><br />{policy.dataAccess}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {policy.moduleAccess.map((module) => (
                <span key={module} className="rounded-sm border border-white/10 bg-white/[0.045] px-2 py-1 text-xs text-graphite-300">{module}</span>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-gold-100"><LockKeyhole className="size-3" />{policy.approvalPolicy}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
