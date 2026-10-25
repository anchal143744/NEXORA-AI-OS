'use client';

import { Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSsoMutation } from '@/hooks/use-auth-actions';
import { ssoSchema, type SsoFormValues } from './auth-schemas';

export function SsoPanel() {
  const form = useForm<SsoFormValues>({ resolver: zodResolver(ssoSchema), defaultValues: { domain: '' } });
  const sso = useSsoMutation();

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit((values) => sso.mutate(values))}>
      <label className="text-xs font-medium text-graphite-400" htmlFor="sso-domain">Company domain</label>
      <div className="flex gap-2">
        <Input id="sso-domain" placeholder="company.com" {...form.register('domain')} invalid={Boolean(form.formState.errors.domain)} />
        <Button type="submit" variant="outline" disabled={sso.isPending}>
          <Building2 className="size-4" />
          SSO
        </Button>
      </div>
      {form.formState.errors.domain ? <p className="text-xs text-red-200">{form.formState.errors.domain.message}</p> : null}
    </form>
  );
}
