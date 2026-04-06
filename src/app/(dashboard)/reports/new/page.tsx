import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getOrgId } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { NewReportForm } from './new-report-form';

export const metadata: Metadata = {
  title: 'Generer un rapport — CompliPilot',
  description: 'Generez un rapport de conformite pour votre organisation.',
};

export default async function NewReportPage() {
  const orgId = await getOrgId();
  if (!orgId) redirect('/onboarding');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Generer un rapport"
        description="Choisissez le type de rapport et les parametres de generation"
      />
      <NewReportForm />
    </div>
  );
}
