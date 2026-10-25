'use client';

import { ClipboardCheck, Flag, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { launchChecklist, launchMilestones, launchRisks } from '@/lib/public-launch';
import { LaunchPanel, LaunchStatusBadge } from './public-launch-panel';

export function LaunchCommandCenter() {
  return (
    <LaunchPanel title="Launch Command Center" description="Launch Checklist, Launch Status, Launch Milestones, Risk Tracking and Readiness Score for public launch operations." badge="Launch Checklist">
      <div className="grid gap-4 xl:grid-cols-3">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><ClipboardCheck className="size-4 text-gold-200" />Launch Checklist</div>
          {launchChecklist.map((item) => (
            <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-white">{item.title}</div>
                <LaunchStatusBadge status={item.status} />
              </div>
              <p className="mt-2 text-xs text-graphite-400">{item.owner}</p>
              <p className="mt-3 text-sm leading-6 text-graphite-300">{item.evidence}</p>
            </article>
          ))}
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><Flag className="size-4 text-gold-200" />Launch Milestones</div>
          {launchMilestones.map((milestone) => (
            <article key={milestone.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-white">{milestone.milestone}</div>
                <LaunchStatusBadge status={milestone.status} />
              </div>
              <Badge className="mt-3" variant="neutral">{milestone.target}</Badge>
              <p className="mt-3 text-sm leading-6 text-graphite-300">{milestone.dependency}</p>
            </article>
          ))}
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><ShieldAlert className="size-4 text-gold-200" />Risk Tracking</div>
          {launchRisks.map((risk) => (
            <article key={risk.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-white">{risk.risk}</div>
                <LaunchStatusBadge status={risk.status} />
              </div>
              <Badge className="mt-3" variant="warning">{risk.severity}</Badge>
              <p className="mt-3 text-sm leading-6 text-graphite-300">{risk.mitigation}</p>
            </article>
          ))}
        </section>
      </div>
    </LaunchPanel>
  );
}
