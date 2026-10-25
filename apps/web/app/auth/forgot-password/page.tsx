import { AuthLayout } from '@/features/auth/auth-layout';
import { ForgotPasswordForm } from '@/features/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout mode="forgot">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
