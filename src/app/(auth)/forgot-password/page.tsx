import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Mot de passe oublie',
  description: 'Reinitialiser votre mot de passe CompliPilot.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
