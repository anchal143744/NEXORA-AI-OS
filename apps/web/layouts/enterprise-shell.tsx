'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { AdaptiveSidebar } from '@/components/shell/adaptive-sidebar';
import { TopNavigation } from '@/components/shell/top-navigation';
import { WorkspaceHeader } from '@/components/shell/workspace-header';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { motionTokens } from '@/lib/motion';

export function EnterpriseShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-graphite-990 text-graphite-50">
      <AdaptiveSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavigation />
        <main className="flex min-w-0 flex-1" id="main-content" tabIndex={-1}>
          <motion.section {...motionTokens.page} className="min-w-0 flex-1 overflow-auto scrollbar-luxury">
            <div className="page-shell safe-x p-4 md:p-6">
              <Breadcrumbs className="mb-4" />
              <WorkspaceHeader />
              {children}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
