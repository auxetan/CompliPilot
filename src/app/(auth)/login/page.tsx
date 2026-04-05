import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous a votre compte CompliPilot.',
};

export default function LoginPage() {
  return <LoginForm />;
}
