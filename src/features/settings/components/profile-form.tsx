'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { updateProfile, uploadAvatar } from '@/features/settings/actions';

interface ProfileFormProps {
  profile: {
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : profile.email.slice(0, 2).toUpperCase();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateProfile(formData);
        toast.success('Profil mis a jour');
      } catch {
        toast.error('Erreur lors de la mise a jour');
      }
    });
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image trop volumineuse (max 2 Mo)');
      return;
    }
    const formData = new FormData();
    formData.set('avatar', file);
    startTransition(async () => {
      try {
        await uploadAvatar(formData);
        toast.success('Avatar mis a jour');
      } catch {
        toast.error("Erreur lors de l'upload");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profil</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.fullName ?? ''} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Label
                htmlFor="avatar-upload"
                className="cursor-pointer text-sm font-medium text-primary hover:underline"
              >
                Changer l&apos;avatar
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground">JPG, PNG. Max 2 Mo.</p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input id="fullName" name="fullName" defaultValue={profile.fullName ?? ''} required />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">L&apos;email ne peut pas etre modifie.</p>
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
