'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ChevronLeft, LayoutGrid, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buildNavigation, groupNavigation } from '@/features/navigation/navigation-engine';
import { motionTokens } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/providers/workspace-provider';
import { useShellStore } from '@/stores/shell-store';

const labels: Record<string, string> = {
  operate: 'Operate',
  intelligence: 'Intelligence',
  automation: 'Automation',
  system: 'System',
};

function SidebarContent({ mobile = false }: { mobile?: boolean }) {
  const workspace = useWorkspace();
  const collapsed = useShellStore((state) => state.sidebarCollapsed);
  const setCollapsed = useShellStore((state) => state.setSidebarCollapsed);
  const setMobileOpen = useShellStore((state) => state.setMobileSidebarOpen);
  const grouped = groupNavigation(buildNavigation(workspace));
  const pathname = usePathname();
  const compact = collapsed && !mobile;

  return (
    <div className="flex h-full min-h-screen flex-col p-3">
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-gold-500/30 bg-gold-500 text-graphite-990 shadow-gold">
            <LayoutGrid className="size-4" />
          </div>
          {!compact ? (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">NEXORA AI OS</div>
              <div className="truncate text-xs text-graphite-400">AI business workspace</div>
            </div>
          ) : null}
        </div>
        {mobile ? (
          <Button variant="icon" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
            <X className="size-4" />
          </Button>
        ) : (
          <Button variant="icon" size="icon" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            <ChevronLeft className={cn('size-4 transition-transform', compact && 'rotate-180')} />
          </Button>
        )}
      </div>

      <nav className="mt-5 space-y-5" aria-label="Workspace navigation">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            {!compact ? <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-graphite-500">{labels[group] ?? group}</div> : null}
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.route || pathname.startsWith(item.route + '/');
                return (
                  <a
                    key={item.key}
                    href={item.route}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-graphite-300 transition duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:premium-focus',
                      active && 'border border-gold-500/20 bg-gold-500/10 text-gold-100',
                    )}
                    onClick={() => mobile && setMobileOpen(false)}
                  >
                    {Icon ? <Icon className="size-4 shrink-0" /> : null}
                    {!compact ? <span className="truncate">{item.label}</span> : null}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!compact ? (
        <div className="mt-auto rounded-lg border border-gold-500/20 bg-gold-500/10 p-3">
          <Badge>{workspace.industry}</Badge>
          <p className="mt-2 text-xs leading-5 text-graphite-300">This menu adapts to your workspace, role and enabled business areas.</p>
        </div>
      ) : null}
    </div>
  );
}

export function AdaptiveSidebar() {
  const collapsed = useShellStore((state) => state.sidebarCollapsed);
  const mobileOpen = useShellStore((state) => state.mobileSidebarOpen);
  const setMobileOpen = useShellStore((state) => state.setMobileSidebarOpen);

  return (
    <>
      <motion.aside
        animate={collapsed ? 'collapsed' : 'expanded'}
        variants={motionTokens.sidebar}
        className="hidden shrink-0 border-r border-white/10 bg-graphite-950/84 shadow-hairline backdrop-blur-shell lg:block"
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-graphite-990/72 backdrop-blur-md" aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }} className="relative h-full w-[min(320px,88vw)] border-r border-white/10 bg-graphite-950 shadow-shell">
              <SidebarContent mobile />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
