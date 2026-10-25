'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authApi } from '@/services/auth-api';
import { resetPasswordSchema, type ResetPasswordFormValues } from './auth-schemas';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [resetComplete, setResetComplete] = useState(false);
  const resetPassword = useMutation({
    mutationFn: (values: ResetPasswordFormValues) => authApi.resetPassword({ tenantId: values.tenantId, token: values.token, newPassword: values.newPassword }),
    onSuccess: () => setResetComplete(true),
  });
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      tenantId: searchParams.get('tenantId') ?? '',
      token: searchParams.get('token') ?? '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  return (
    <Card className="shadow-glow">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Set a new password with the reset token from your email.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {resetComplete ? (
          <Alert title="Password reset complete" variant="success">
            Your password was updated and existing sessions were revoked. You can now sign in again.
          </Alert>
        ) : null}
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => resetPassword.mutate(values))}>
          <div className="space-y-2">
            <label htmlFor="reset-tenant" className="text-xs font-medium text-graphite-400">Tenant ID</label>
            <Input id="reset-tenant" {...form.register('tenantId')} invalid={Boolean(form.formState.errors.tenantId)} />
            {form.formState.errors.tenantId ? <p className="text-xs text-red-200">{form.formState.errors.tenantId.message}</p> : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="reset-token" className="text-xs font-medium text-graphite-400">Reset token</label>
            <Input id="reset-token" {...form.register('token')} invalid={Boolean(form.formState.errors.token)} />
            {form.formState.errors.token ? <p className="text-xs text-red-200">{form.formState.errors.token.message}</p> : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-xs font-medium text-graphite-400">New password</label>
              <Input id="new-password" type="password" autoComplete="new-password" {...form.register('newPassword')} invalid={Boolean(form.formState.errors.newPassword)} />
              {form.formState.errors.newPassword ? <p className="text-xs text-red-200">{form.formState.errors.newPassword.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-xs font-medium text-graphite-400">Confirm password</label>
              <Input id="confirm-password" type="password" autoComplete="new-password" {...form.register('confirmPassword')} invalid={Boolean(form.formState.errors.confirmPassword)} />
              {form.formState.errors.confirmPassword ? <p className="text-xs text-red-200">{form.formState.errors.confirmPassword.message}</p> : null}
            </div>
          </div>
          {resetPassword.error ? <Alert title="Password reset failed" variant="danger">{resetPassword.error.message}</Alert> : null}
          <Button type="submit" className="w-full" disabled={resetPassword.isPending || resetComplete}>
            <ShieldCheck className="size-4" aria-hidden="true" />
            {resetPassword.isPending ? 'Resetting password' : 'Reset password'}
          </Button>
        </form>
        <div className="text-sm text-graphite-400">
          Ready to return? <Link href="/auth/login" className="text-gold-200 hover:text-gold-100">Sign in</Link>
        </div>
      </CardContent>
    </Card>
  );
}
