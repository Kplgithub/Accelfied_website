import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/components/auth/password-forms';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Get a link to set a new Accelfied password.',
  alternates: { canonical: '/forgot-password' },
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell eyebrow="Account help" title="Forgot your password?" intro="Enter the email you joined with and we will send you a link to set a new one.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
