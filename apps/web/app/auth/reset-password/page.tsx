import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthLayout } from '@/features/auth/auth-layout';
import { ResetPasswordForm } from '@/features/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <AuthLayout mode="reset">
      <Suspense fallback={<Skeleton className="h-[520px] w-full rounded-lg" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
