'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chrome, Mail, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authApi } from '@/services/auth-api';
import { useLoginMutation } from '@/hooks/use-auth-actions';
import { loginSchema, type LoginFormValues } from './auth-schemas';
import { SsoPanel } from './sso-panel';

export function LoginForm() {
  const router = useRouter();
  const login = useLoginMutation();
  const [oauthProvider, setOauthProvider] = useState<'google' | 'microsoft' | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberDevice: true },
  });

  async function startOAuth(provider: 'google' | 'microsoft') {
    setOauthError(null);
    setOauthProvider(provider);
    try {
      await authApi.startOAuth(provider);
    } catch (error) {
      setOauthError(error instanceof Error ? error.message : 'Unable to start OAuth login');
      setOauthProvider(null);
    }
  }

  return (
    <Card className="shadow-glow">
      <CardHeader>
        <CardTitle>Email Login</CardTitle>
        <CardDescription>Use your verified work email to access the enterprise workspace.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="subtle" onClick={() => void startOAuth('google')} disabled={oauthProvider !== null}>
            <Chrome className="size-4" aria-hidden="true" />
            {oauthProvider === 'google' ? 'Opening Google' : 'Google'}
          </Button>
          <Button type="button" variant="subtle" onClick={() => void startOAuth('microsoft')} disabled={oauthProvider !== null}>
            <ShieldCheck className="size-4" aria-hidden="true" />
            {oauthProvider === 'microsoft' ? 'Opening Microsoft' : 'Microsoft'}
          </Button>
        </div>

        {oauthError ? <Alert title="OAuth login needs attention" variant="warning">{oauthError}</Alert> : null}


        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) =>
            login.mutate(values, {
              onSuccess: () => router.push('/onboarding'),
            }),
          )}
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium text-graphite-400">Work email</label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...form.register('email')} invalid={Boolean(form.formState.errors.email)} />
            {form.formState.errors.email ? <p className="text-xs text-red-200">{form.formState.errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="password" className="text-xs font-medium text-graphite-400">Password</label>
              <Link href={"/auth/forgot-password" as Route} className="text-xs text-gold-200 transition hover:text-gold-100">Forgot password?</Link>
            </div>
            <Input id="password" type="password" autoComplete="current-password" placeholder="Enterprise password" {...form.register('password')} invalid={Boolean(form.formState.errors.password)} />
            {form.formState.errors.password ? <p className="text-xs text-red-200">{form.formState.errors.password.message}</p> : null}
          </div>

          <label className="flex items-center gap-2 text-sm text-graphite-300">
            <input type="checkbox" className="size-4 accent-gold-500" {...form.register('rememberDevice')} />
            Trust this device for session continuity
          </label>

          {login.error ? <Alert title="Login failed" variant="danger">{login.error.message}</Alert> : null}

          <Button type="submit" className="w-full" disabled={login.isPending}>
            <Mail className="size-4" aria-hidden="true" />
            {login.isPending ? 'Signing in' : 'Continue securely'}
          </Button>
        </form>

        <SsoPanel />

        <div className="text-sm text-graphite-400">
          New to NEXORA? <Link href={"/auth/signup" as Route} className="text-gold-200 hover:text-gold-100">Create your operating system</Link>
        </div>
      </CardContent>
    </Card>
  );
}
