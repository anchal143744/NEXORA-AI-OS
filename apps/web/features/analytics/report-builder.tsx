'use client';

import { CalendarClock, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reports } from '@/lib/analytics-workspace';
import { useAnalyticsWorkspaceActions } from '@/hooks/use-analytics-workspace-actions';

export function ReportBuilder() {
  const { scheduleReport } = useAnalyticsWorkspaceActions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Builder</CardTitle>
        <p className="text-sm text-graphite-400">Drag-and-drop report foundation with saved reports, scheduling, PDF export and Excel export.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-4">
        {reports.map((report) => (
          <article key={report.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Badge><FileDown className="size-3" />{report.format}</Badge>
            <h3 className="mt-3 text-sm font-semibold text-white">{report.name}</h3>
            <p className="mt-2 flex items-center gap-2 text-xs text-graphite-400"><CalendarClock className="size-3 text-gold-200" />{report.schedule}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {report.sections.map((section) => (
                <span key={section} className="rounded-sm border border-white/10 bg-graphite-950/70 px-2 py-1 text-xs text-graphite-300">{section}</span>
              ))}
            </div>
            <Button className="mt-4 w-full" size="sm" onClick={() => scheduleReport(report.id)}>Schedule report</Button>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
