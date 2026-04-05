import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = {
  title: 'Creer un compte',
  description: 'Creez votre compte CompliPilot et simplifiez votre conformite IA.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
