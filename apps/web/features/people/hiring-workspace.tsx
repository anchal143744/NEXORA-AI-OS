'use client';

import { BriefcaseBusiness, CalendarPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';

export function HiringWorkspace() {
  const jobs = usePeopleWorkspaceStore((state) => state.jobs);
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge><BriefcaseBusiness className="size-3" />Hiring Workspace</Badge>
          <CardTitle className="mt-2">Jobs, postings, candidate tracking and interview scheduling.</CardTitle>
          <CardDescription>Keep hiring clear: what is open, who owns it and where candidates are moving.</CardDescription>
        </div>
        <Button size="sm"><CalendarPlus className="size-4" />Create job</Button>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-3">
        {jobs.map((job) => (
          <article key={job.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="text-base font-semibold text-white">{job.title}</div>
            <div className="mt-1 text-sm text-graphite-300">{job.department} - {job.location}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={job.status === 'offer' ? 'success' : job.status === 'interviewing' ? 'warning' : 'neutral'}>{job.status}</Badge>
              <Badge variant="neutral">{job.candidates} candidates</Badge>
            </div>
            <div className="mt-3 text-xs text-graphite-400">Hiring manager: {job.hiringManager}</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
