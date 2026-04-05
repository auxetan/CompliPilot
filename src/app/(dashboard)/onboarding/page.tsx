import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { OnboardingForm } from '@/features/auth/components/onboarding-form';

export const metadata: Metadata = {
  title: 'Configuration',
  description: 'Configurez votre organisation CompliPilot.',
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2 text-xl font-semibold">
        <ShieldCheck className="h-7 w-7 text-primary" />
        <span>CompliPilot</span>
      </div>
      <OnboardingForm />
    </div>
  );
}
