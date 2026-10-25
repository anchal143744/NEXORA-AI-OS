'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useSendInvite } from '@/hooks/use-onboarding-actions';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { inviteSchema, type InviteFormValues } from './onboarding-schemas';

export function EnterpriseInviteSystem() {
  const invite = useSendInvite();
  const completeStep = useOnboardingStore((state) => state.completeStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const form = useForm<InviteFormValues>({ resolver: zodResolver(inviteSchema), defaultValues: { email: '', role: 'Admin', team: 'Leadership' } });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="size-4 text-gold-300" />Enterprise Invite System</CardTitle>
        <CardDescription>Invite initial operators with role intent and team context. Delivery is handled by the backend invite API.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-3 md:grid-cols-[1fr_180px_160px_auto]"
          onSubmit={form.handleSubmit((values) =>
            invite.mutate(values, {
              onSettled: () => {
                completeStep('invite');
                setCurrentStep('roles');
              },
            }),
          )}
        >
          <Input type="email" placeholder="teammate@company.com" {...form.register('email')} invalid={Boolean(form.formState.errors.email)} />
          <Select options={[{ label: 'Admin', value: 'Admin' }, { label: 'Manager', value: 'Manager' }, { label: 'Employee', value: 'Employee' }, { label: 'Viewer', value: 'Viewer' }]} {...form.register('role')} />
          <Input placeholder="Team" {...form.register('team')} />
          <Button type="submit" disabled={invite.isPending}><Send className="size-4" />Invite</Button>
        </form>
        {invite.error ? <p className="mt-3 text-xs text-amber-100">Invite API is not reachable in this environment; the flow can still continue for frontend validation.</p> : null}
      </CardContent>
    </Card>
  );
}
