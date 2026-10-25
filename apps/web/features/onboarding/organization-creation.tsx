'use client';

import { Building2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function OrganizationCreation() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const completeStep = useOnboardingStore((state) => state.completeStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const organizationId = session?.organizationId ?? user?.organizationId;
  const workspaceId = session?.workspaceId ?? user?.workspaceId;
  const canContinue = hydrated && Boolean(organizationId && workspaceId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Building2 className="size-4 text-gold-300" />Organization Creation</CardTitle>
        <CardDescription>Tenant, organization and first workspace context are prepared before business classification begins.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {['Tenant isolation', 'Workspace context', 'Audit-ready first owner'].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm text-graphite-200">
              <ShieldCheck className="mb-3 size-4 text-gold-300" />
              {item}
            </div>
          ))}
        </div>
        {!hydrated ? <p className="text-xs text-graphite-400">Restoring authenticated organization context...</p> : null}
        {hydrated && !canContinue ? <p className="text-xs text-red-200">Organization and workspace context were not found. Sign in again before continuing onboarding.</p> : null}
        <Button
          onClick={() => {
            if (!canContinue) return;
            completeStep('organization');
            setCurrentStep('business');
          }}
          disabled={!canContinue}
        >
          Verify organization context
        </Button>
      </CardContent>
    </Card>
  );
}
