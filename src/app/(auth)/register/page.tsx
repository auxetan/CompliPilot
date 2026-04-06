import { Suspense } from 'react';
import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/register-form';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Creer un compte',
  description: 'Creez votre compte CompliPilot et simplifiez votre conformite IA.',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[460px] w-full rounded-lg" />}>
      <RegisterForm />
    </Suspense>
  );
}
