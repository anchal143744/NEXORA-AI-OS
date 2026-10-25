'use client';

import { Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';

export function OrganizationChart() {
  const nodes = usePeopleWorkspaceStore((state) => state.orgNodes);
  const leaders = nodes.filter((node) => !node.managerId);
  return (
    <Card>
      <CardHeader>
        <Badge><Network className="size-3" />Organization Chart</Badge>
        <CardTitle className="mt-2">Department structure, reporting hierarchy and team visualization.</CardTitle>
        <CardDescription>Readable hierarchy for employees and managers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaders.map((leader) => (
          <section key={leader.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="text-base font-semibold text-white">{leader.name}</div>
            <div className="mt-1 text-sm text-graphite-300">{leader.role} - {leader.department}</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {nodes.filter((node) => node.managerId === leader.id || nodes.find((parent) => parent.id === node.managerId)?.managerId === leader.id).map((node) => (
                <article key={node.id} className="rounded-md border border-white/10 bg-graphite-950/70 p-3">
                  <div className="text-sm font-medium text-white">{node.name}</div>
                  <div className="mt-1 text-xs text-graphite-400">{node.role}</div>
                  <Badge className="mt-2" variant="neutral">{node.department}</Badge>
                </article>
              ))}
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}
