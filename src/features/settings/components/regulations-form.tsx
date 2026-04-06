'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateRegulations } from '@/features/settings/actions';

interface RegulationsFormProps {
  activeRegulations: string[];
}

const REGULATIONS = [
  { id: 'eu_ai_act', label: 'EU AI Act', description: "Reglementation europeenne sur l'IA" },
  { id: 'gdpr', label: 'RGPD', description: 'Reglement general sur la protection des donnees' },
  {
    id: 'nis2',
    label: 'NIS2',
    description: "Directive sur la securite des reseaux et systemes d'information",
  },
  { id: 'dora', label: 'DORA', description: 'Digital Operational Resilience Act' },
];

export function RegulationsForm({ activeRegulations }: RegulationsFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateRegulations(formData);
        toast.success('Reglementations mises a jour');
      } catch {
        toast.error('Erreur lors de la mise a jour');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reglementations actives</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {REGULATIONS.map((reg) => (
              <label
                key={reg.id}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="regulations"
                  value={reg.id}
                  defaultChecked={activeRegulations.includes(reg.id)}
                  className="mt-0.5 h-4 w-4 rounded border-border"
                />
                <div>
                  <p className="text-sm font-medium">{reg.label}</p>
                  <p className="text-xs text-muted-foreground">{reg.description}</p>
                </div>
              </label>
            ))}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
