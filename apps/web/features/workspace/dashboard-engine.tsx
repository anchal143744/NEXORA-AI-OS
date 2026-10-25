'use client';

import { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, Save, Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { filterWidgetsByPermissions } from './permission-engine';
import {
  applyWorkspacePersonalization,
  loadWorkspacePersonalization,
  moveWidgetInLayout,
  saveCurrentLayout,
  saveWorkspacePersonalization,
  togglePinnedWidget,
} from './workspace-personalization';
import { WorkspaceWidgetCard } from './widget-registry';
import type { WorkspaceConfiguration, WorkspacePersonalization } from '@/types/workspace';

export function DashboardEngine({ config }: { config: WorkspaceConfiguration }) {
  const permittedWidgets = useMemo(() => filterWidgetsByPermissions(config.widgets, config.permissions), [config.widgets, config.permissions]);
  const [personalization, setPersonalization] = useState<WorkspacePersonalization>(() => config.personalization);

  useEffect(() => {
    setPersonalization(loadWorkspacePersonalization(config.workspaceId, permittedWidgets));
  }, [config.workspaceId, permittedWidgets]);

  const widgets = useMemo(() => applyWorkspacePersonalization(permittedWidgets, personalization), [permittedWidgets, personalization]);

  function updatePersonalization(next: WorkspacePersonalization) {
    setPersonalization(next);
    saveWorkspacePersonalization(config.workspaceId, next);
  }

  return (
    <section className="space-y-4" aria-labelledby="dynamic-dashboard-title">
      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Badge>
            <LayoutGrid className="size-3" />
            Personal operating view
          </Badge>
          <h2 id="dynamic-dashboard-title" className="mt-3 text-2xl font-semibold text-white">
            A dashboard shaped around this business
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite-400">
            Your view shows the insights, actions and alerts available to your role, with saved layouts for repeat work.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">{widgets.length} visible insights</Badge>
          <Badge variant="neutral">{personalization.pinnedWidgetIds.length} pinned</Badge>
          <Button variant="outline" onClick={() => updatePersonalization(saveCurrentLayout(personalization, 'Saved operating view'))}>
            <Save className="size-4" />
            Save layout
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <PersonalizationSummary label="Favorites" value={personalization.favoriteModuleKeys.map((key) => key.toUpperCase()).join(', ')} icon={<Star className="size-4" />} />
        <PersonalizationSummary label="Recent" value={String(personalization.recentItemIds.length) + ' workspace items'} icon={<Sparkles className="size-4" />} />
        <PersonalizationSummary label="Saved layouts" value={String(personalization.savedLayouts.length) + ' layout profiles'} icon={<LayoutGrid className="size-4" />} />
      </div>

      {widgets.length === 0 ? (
        <EmptyState title="No insights available yet" description="Your current role does not have access to dashboard insights for this workspace. Ask an admin for access or choose another workspace." icon={LayoutGrid} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-6">
          {widgets.map((widget) => (
            <WorkspaceWidgetCard
              key={widget.id}
              widget={widget}
              config={config}
              pinned={personalization.pinnedWidgetIds.includes(widget.id)}
              onTogglePinned={() => updatePersonalization(togglePinnedWidget(personalization, widget.id))}
              onMoveLeft={() => updatePersonalization(moveWidgetInLayout(personalization, widget.id, 'left'))}
              onMoveRight={() => updatePersonalization(moveWidgetInLayout(personalization, widget.id, 'right'))}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PersonalizationSummary({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <span className="grid size-8 place-items-center rounded-md bg-gold-500/15 text-gold-100">{icon}</span>
        {label}
      </div>
      <p className="mt-3 text-sm leading-6 text-graphite-400">{value}</p>
    </div>
  );
}
