'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getStoredAuthSession } from '@/lib/api-client';
import { authApi } from '@/services/auth-api';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from './auth-schemas';

export function ForgotPasswordForm() {
  const defaultTenantId = useMemo(() => {
    const stored = getStoredAuthSession();
    return stored.session?.tenantId ?? stored.user?.tenantId ?? '';
  }, []);
  const [sent, setSent] = useState(false);
  const forgotPassword = useMutation({
    mutationFn: (values: ForgotPasswordFormValues) => authApi.forgotPassword(values),
    onSuccess: () => setSent(true),
  });
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { tenantId: defaultTenantId, email: '' },
  });

  return (
    <Card className="shadow-glow">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Request a reset email for the tenant-scoped account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {sent ? (
          <Alert title="Reset email requested" variant="success">
            If the account exists in this tenant, NEXORA has sent a secure password reset email.
          </Alert>
        ) : null}
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => forgotPassword.mutate(values))}>
          <div className="space-y-2">
            <label htmlFor="tenantId" className="text-xs font-medium text-graphite-400">Tenant ID</label>
            <Input id="tenantId" placeholder="00000000-0000-0000-0000-000000000000" {...form.register('tenantId')} invalid={Boolean(form.formState.errors.tenantId)} />
            {form.formState.errors.tenantId ? <p className="text-xs text-red-200">{form.formState.errors.tenantId.message}</p> : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="forgot-email" className="text-xs font-medium text-graphite-400">Work email</label>
            <Input id="forgot-email" type="email" autoComplete="email" placeholder="you@company.com" {...form.register('email')} invalid={Boolean(form.formState.errors.email)} />
            {form.formState.errors.email ? <p className="text-xs text-red-200">{form.formState.errors.email.message}</p> : null}
          </div>
          {forgotPassword.error ? <Alert title="Reset request failed" variant="danger">{forgotPassword.error.message}</Alert> : null}
          <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
            <KeyRound className="size-4" aria-hidden="true" />
            {forgotPassword.isPending ? 'Sending reset email' : 'Send reset email'}
          </Button>
        </form>
        <div className="text-sm text-graphite-400">
          Remembered access? <Link href="/auth/login" className="text-gold-200 hover:text-gold-100">Return to login</Link>
        </div>
      </CardContent>
    </Card>
  );
}
