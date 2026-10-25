'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Menu, PanelRightOpen, Search, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from '@/components/search/global-search';
import { NotificationCenter } from './notification-center';
import { OrganizationSwitcher } from './organization-switcher';
import { ProfileMenu } from './profile-menu';
import { WorkspaceSwitcher } from './workspace-switcher';
import { useShellStore } from '@/stores/shell-store';

const CommandPalette = dynamic(() => import('@/components/command/command-palette').then((module) => module.CommandPalette), {
  ssr: false,
});

export function TopNavigation() {
  const setCommandOpen = useShellStore((state) => state.setCommandOpen);
  const setCopilotOpen = useShellStore((state) => state.setCopilotOpen);
  const setMobileOpen = useShellStore((state) => state.setMobileSidebarOpen);
  const copilotOpen = useShellStore((state) => state.copilotOpen);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-graphite-950/78 px-3 py-3 shadow-hairline backdrop-blur-shell md:px-4" role="banner">
      <div className="flex items-center gap-2 md:gap-3">
        <Button variant="icon" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <Menu className="size-4" />
        </Button>
        <div className="hidden min-w-0 items-center gap-2 xl:flex">
          <OrganizationSwitcher />
          <WorkspaceSwitcher />
        </div>
        <GlobalSearch />
        <Button variant="subtle" onClick={() => setCommandOpen(true)} aria-label="Open command palette">
          <Search className="size-4" />
          <span className="hidden md:inline">Command</span>
          <kbd className="hidden rounded-sm border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-xs text-graphite-400 md:inline">Ctrl K</kbd>
        </Button>
        <NotificationCenter />
        <Button asChild variant="icon" size="icon" aria-label="Open settings">
          <Link href="/settings">
            <Settings2 className="size-4" />
          </Link>
        </Button>
        <Button variant="icon" size="icon" onClick={() => setCopilotOpen(!copilotOpen)} aria-label="Toggle AI dock">
          <PanelRightOpen className="size-4" />
        </Button>
        <ProfileMenu />
      </div>
      <CommandPalette />
    </header>
  );
}
