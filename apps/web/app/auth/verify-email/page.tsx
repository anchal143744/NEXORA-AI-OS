import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthLayout } from '@/features/auth/auth-layout';
import { EmailVerificationPanel } from '@/features/auth/email-verification-panel';

export default function VerifyEmailPage() {
  return (
    <AuthLayout mode="verify">
      <Suspense fallback={<Skeleton className="h-[620px] w-full rounded-lg" />}>
        <EmailVerificationPanel />
      </Suspense>
    </AuthLayout>
  );
}
