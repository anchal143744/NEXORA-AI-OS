'use client';

import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthLayout } from '@/features/auth/auth-layout';

export function InviteAcceptance() {
  return (
    <AuthLayout mode="signup">
      <Card className="shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MailCheck className="size-4 text-gold-300" />Enterprise Invite</CardTitle>
          <CardDescription>Accept an invite after authentication so role, tenant and workspace context can be validated by the backend.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-graphite-300">Invite tokens are handled by the API layer. This page provides the secure frontend acceptance surface for invited users.</p>
          <Button asChild><Link href="/auth/signup">Create account to accept</Link></Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
