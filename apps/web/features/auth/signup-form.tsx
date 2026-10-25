'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useSignupMutation } from '@/hooks/use-auth-actions';
import { signupSchema, type SignupFormValues } from './auth-schemas';

export function SignupForm() {
  const router = useRouter();
  const signup = useSignupMutation();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', companyName: '', role: 'Founder / Owner' },
  });

  return (
    <Card className="shadow-glow">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Set up the first owner, organization and starting workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) =>
            signup.mutate(values, {
              onSuccess: (response) => {
                if (response.verificationRequired && response.session.tenantId) {
                  const query = new URLSearchParams({ tenantId: response.session.tenantId, email: response.user.email });
                  router.push(('/auth/verify-email?' + query.toString()) as Route);
                  return;
                }
                router.push('/onboarding' as Route);
              },
            }),
          )}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-medium text-graphite-400">Full name</label>
              <Input id="name" placeholder="Avery Stone" {...form.register('name')} invalid={Boolean(form.formState.errors.name)} />
              {form.formState.errors.name ? <p className="text-xs text-red-200">{form.formState.errors.name.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-xs font-medium text-graphite-400">Work email</label>
              <Input id="signup-email" type="email" placeholder="you@company.com" {...form.register('email')} invalid={Boolean(form.formState.errors.email)} />
              {form.formState.errors.email ? <p className="text-xs text-red-200">{form.formState.errors.email.message}</p> : null}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="company" className="text-xs font-medium text-graphite-400">Organization</label>
            <Input id="company" placeholder="Company Inc." {...form.register('companyName')} invalid={Boolean(form.formState.errors.companyName)} />
            {form.formState.errors.companyName ? <p className="text-xs text-red-200">{form.formState.errors.companyName.message}</p> : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-xs font-medium text-graphite-400">Password</label>
              <Input id="signup-password" type="password" placeholder="Minimum 12 characters" {...form.register('password')} invalid={Boolean(form.formState.errors.password)} />
              {form.formState.errors.password ? <p className="text-xs text-red-200">{form.formState.errors.password.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-xs font-medium text-graphite-400">Primary role</label>
              <Select id="role" options={[{ label: 'Founder / Owner', value: 'Founder / Owner' }, { label: 'Executive', value: 'Executive' }, { label: 'Operations Leader', value: 'Operations Leader' }, { label: 'IT Admin', value: 'IT Admin' }]} {...form.register('role')} />
            </div>
          </div>
          {signup.error ? <Alert title="Signup failed" variant="danger">{signup.error.message}</Alert> : null}
          <Button type="submit" className="w-full" disabled={signup.isPending}>
            <UserPlus className="size-4" aria-hidden="true" />
            {signup.isPending ? 'Creating account' : 'Create account and verify email'}
          </Button>
          <div className="text-sm text-graphite-400">
            Already have access? <Link href={"/auth/login" as Route} className="text-gold-200 hover:text-gold-100">Sign in</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
