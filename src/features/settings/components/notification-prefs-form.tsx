'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateNotificationPreferences } from '@/features/settings/actions';

interface NotificationPrefsFormProps {
  prefs: {
    emailCritical: boolean;
    weeklyDigest: boolean;
    documentReminders: boolean;
  };
}

const NOTIFICATION_OPTIONS = [
  {
    id: 'emailCritical',
    label: 'Alertes critiques par email',
    description: 'Recevoir un email pour les alertes de severite critique',
  },
  {
    id: 'weeklyDigest',
    label: 'Resume hebdomadaire',
    description: 'Recevoir un email recapitulatif chaque lundi',
  },
  {
    id: 'documentReminders',
    label: 'Rappels de documents',
    description: "Notifications avant l'expiration des documents",
  },
] as const;

export function NotificationPrefsForm({ prefs }: NotificationPrefsFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateNotificationPreferences(formData);
        toast.success('Preferences mises a jour');
      } catch {
        toast.error('Erreur lors de la mise a jour');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Preferences de notification</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {NOTIFICATION_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={opt.id}
                  defaultChecked={prefs[opt.id]}
                  className="mt-0.5 h-4 w-4 rounded border-border"
                />
                <div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
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
