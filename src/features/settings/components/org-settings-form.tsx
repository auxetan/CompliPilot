'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateOrganization } from '@/features/settings/actions';

interface OrgSettingsFormProps {
  org: { name: string; industry: string | null; country: string | null };
}

export function OrgSettingsForm({ org }: OrgSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateOrganization(formData);
        toast.success('Organisation mise a jour');
      } catch {
        toast.error('Erreur lors de la mise a jour');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Informations de l&apos;organisation</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" defaultValue={org.name} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="industry">Secteur d&apos;activite</Label>
              <Input id="industry" name="industry" defaultValue={org.industry ?? ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input id="country" name="country" defaultValue={org.country ?? 'FR'} />
            </div>
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
