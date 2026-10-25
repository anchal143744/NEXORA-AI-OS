'use client';

import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAssignRole } from '@/hooks/use-onboarding-actions';
import { useOnboardingStore } from '@/stores/onboarding-store';

const permissions = ['Create', 'Read', 'Update', 'Delete', 'Manage', 'Approve', 'Execute'];

export function RoleAssignmentPanel() {
  const assignRole = useAssignRole();
  const completeStep = useOnboardingStore((state) => state.completeStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldCheck className="size-4 text-gold-300" />Role Assignment</CardTitle>
        <CardDescription>Prepare initial access boundaries for the first workspace.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {permissions.map((permission) => <Badge key={permission} variant="neutral">{permission}</Badge>)}
        </div>
        <Button
          onClick={() => assignRole.mutate(
            { role: 'Organization Owner', permissions },
            {
              onSettled: () => {
                completeStep('roles');
                setCurrentStep('finish');
              },
            },
          )}
          disabled={assignRole.isPending}
        >
          Assign owner policy
        </Button>
      </CardContent>
    </Card>
  );
}
