'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgeCheck, MailCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authApi } from '@/services/auth-api';
import {
  requestVerificationSchema,
  type RequestVerificationFormValues,
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from './auth-schemas';

export function EmailVerificationPanel() {
  const searchParams = useSearchParams();
  const queryTenantId = searchParams.get('tenantId') ?? '';
  const queryToken = searchParams.get('token') ?? '';
  const queryEmail = searchParams.get('email') ?? '';
  const [autoAttempted, setAutoAttempted] = useState(false);

  const verifyEmail = useMutation({
    mutationFn: (values: VerifyEmailFormValues) => authApi.verifyEmail(values),
  });
  const requestVerification = useMutation({
    mutationFn: (values: RequestVerificationFormValues) => authApi.requestEmailVerification(values),
  });

  const verifyForm = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { tenantId: queryTenantId, token: queryToken },
  });
  const requestForm = useForm<RequestVerificationFormValues>({
    resolver: zodResolver(requestVerificationSchema),
    defaultValues: { tenantId: queryTenantId, email: queryEmail },
  });

  useEffect(() => {
    if (!autoAttempted && queryTenantId && queryToken) {
      setAutoAttempted(true);
      verifyEmail.mutate({ tenantId: queryTenantId, token: queryToken });
    }
  }, [autoAttempted, queryTenantId, queryToken, verifyEmail]);

  return (
    <Card className="shadow-glow">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>Verify an emailed token or request a new verification message.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {verifyEmail.data?.verified ? (
          <Alert title="Email verified" variant="success">
            Your email has been verified for this tenant. Continue into onboarding to complete workspace setup.
          </Alert>
        ) : verifyEmail.data && !verifyEmail.data.verified ? (
          <Alert title="Verification did not match" variant="warning">
            The token was valid but did not match this tenant. Check the link or request a fresh verification email.
          </Alert>
        ) : null}
        {requestVerification.data?.sent ? (
          <Alert title="Verification email sent" variant="success">
            Check your inbox for the latest verification token.
          </Alert>
        ) : null}

        <form className="space-y-4" onSubmit={verifyForm.handleSubmit((values) => verifyEmail.mutate(values))}>
          <div className="space-y-2">
            <label htmlFor="verify-tenant" className="text-xs font-medium text-graphite-400">Tenant ID</label>
            <Input id="verify-tenant" {...verifyForm.register('tenantId')} invalid={Boolean(verifyForm.formState.errors.tenantId)} />
            {verifyForm.formState.errors.tenantId ? <p className="text-xs text-red-200">{verifyForm.formState.errors.tenantId.message}</p> : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="verify-token" className="text-xs font-medium text-graphite-400">Verification token</label>
            <Input id="verify-token" {...verifyForm.register('token')} invalid={Boolean(verifyForm.formState.errors.token)} />
            {verifyForm.formState.errors.token ? <p className="text-xs text-red-200">{verifyForm.formState.errors.token.message}</p> : null}
          </div>
          {verifyEmail.error ? <Alert title="Verification failed" variant="danger">{verifyEmail.error.message}</Alert> : null}
          <Button type="submit" className="w-full" disabled={verifyEmail.isPending}>
            <BadgeCheck className="size-4" aria-hidden="true" />
            {verifyEmail.isPending ? 'Verifying email' : 'Verify email'}
          </Button>
        </form>

        <div className="border-t border-white/10 pt-5">
          <form className="space-y-4" onSubmit={requestForm.handleSubmit((values) => requestVerification.mutate(values))}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="request-tenant" className="text-xs font-medium text-graphite-400">Tenant ID</label>
                <Input id="request-tenant" {...requestForm.register('tenantId')} invalid={Boolean(requestForm.formState.errors.tenantId)} />
                {requestForm.formState.errors.tenantId ? <p className="text-xs text-red-200">{requestForm.formState.errors.tenantId.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label htmlFor="request-email" className="text-xs font-medium text-graphite-400">Work email</label>
                <Input id="request-email" type="email" {...requestForm.register('email')} invalid={Boolean(requestForm.formState.errors.email)} />
                {requestForm.formState.errors.email ? <p className="text-xs text-red-200">{requestForm.formState.errors.email.message}</p> : null}
              </div>
            </div>
            {requestVerification.error ? <Alert title="Could not request verification" variant="danger">{requestVerification.error.message}</Alert> : null}
            <Button type="submit" variant="outline" className="w-full" disabled={requestVerification.isPending}>
              <MailCheck className="size-4" aria-hidden="true" />
              {requestVerification.isPending ? 'Sending verification' : 'Send verification email'}
            </Button>
          </form>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-graphite-400">
          <Link href="/onboarding" className="text-gold-200 hover:text-gold-100">Continue onboarding</Link>
          <Link href="/auth/login" className="text-gold-200 hover:text-gold-100">Return to login</Link>
        </div>
      </CardContent>
    </Card>
  );
}
