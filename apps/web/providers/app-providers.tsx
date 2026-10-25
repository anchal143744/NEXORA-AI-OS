'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ToastViewport } from '@/components/ui/toast';
import { AiProvider } from './ai-provider';
import { AuthProvider } from './auth-provider';
import { LocalizationProvider } from './localization-provider';
import { QueryProvider } from './query-provider';
import { RealtimeProvider } from './realtime-provider';
import { TenantProvider } from './tenant-provider';
import { ThemeProvider } from './theme-provider';
import { WorkspaceProvider } from './workspace-provider';

const PersistentAiCopilot = dynamic(() => import('@/features/ai/persistent-ai-copilot').then((module) => module.PersistentAiCopilot), {
  ssr: false,
});

export function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (['/login', '/signup', '/recover', '/business-setup'].includes(pathname) || pathname === '/' || pathname === '/dashboard' || pathname === '/shop' || pathname.startsWith('/shop/')) {
    return <ThemeProvider><QueryProvider><AuthProvider>{children}<ToastViewport /></AuthProvider></QueryProvider></ThemeProvider>;
  }
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <TenantProvider>
            <WorkspaceProvider>
              <LocalizationProvider>
                <RealtimeProvider>
                  <AiProvider>
                    {children}
                    <PersistentAiCopilot />
                    <ToastViewport />
                  </AiProvider>
                </RealtimeProvider>
              </LocalizationProvider>
            </WorkspaceProvider>
          </TenantProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
