'use client';

import { LayoutDashboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommandCenterStore } from '@/stores/command-center-store';

export function PersonalDashboards() {
  const dashboards = useCommandCenterStore((state) => state.dashboards);
  const selectedDashboard = useCommandCenterStore((state) => state.selectedDashboard);
  const setSelectedDashboard = useCommandCenterStore((state) => state.setSelectedDashboard);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><LayoutDashboard className="size-4 text-gold-300" />Personal Dashboards</CardTitle>
        <CardDescription>Role-specific launch views for executives, operations and finance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {dashboards.map((dashboard) => (
          <button key={dashboard.id} type="button" onClick={() => setSelectedDashboard(dashboard.id)} className={'w-full rounded-lg border p-3 text-left transition focus-visible:premium-focus ' + (selectedDashboard === dashboard.id ? 'border-gold-500/40 bg-gold-500/12' : 'border-white/10 bg-white/[0.045] hover:bg-white/[0.07]')}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-white">{dashboard.title}</div>
              <Badge variant="neutral">{dashboard.role}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">{dashboard.widgets.map((widget) => <Badge key={widget}>{widget}</Badge>)}</div>
          </button>
        ))}
        <Button variant="outline" className="w-full">Customize dashboard</Button>
      </CardContent>
    </Card>
  );
}
