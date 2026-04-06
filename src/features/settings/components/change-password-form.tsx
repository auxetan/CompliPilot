'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { changePassword } from '@/features/settings/actions';

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await changePassword(formData);
        toast.success('Mot de passe mis a jour');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erreur');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Changer le mot de passe</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input id="password" name="password" type="password" minLength={8} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={8}
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Changer le mot de passe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
