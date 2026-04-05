import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { AddToolForm } from '@/features/scanner/components/add-tool-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ajouter un outil IA — CompliPilot',
  description: "Déclarer un nouvel outil d'intelligence artificielle",
};

export default function NewToolPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Ajouter un outil IA"
        description="Déclarez un outil d'intelligence artificielle utilisé par votre entreprise"
        actions={
          <Link href="/scanner">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
        }
      />

      <AddToolForm />
    </div>
  );
}
