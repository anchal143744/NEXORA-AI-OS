import { AuthLayout } from '@/features/auth/auth-layout';
import { SignupForm } from '@/features/auth/signup-form';

export default function SignupPage() {
  return (
    <AuthLayout mode="signup">
      <SignupForm />
    </AuthLayout>
  );
}
