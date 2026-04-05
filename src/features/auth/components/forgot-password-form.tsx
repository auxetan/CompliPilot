'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/auth';
import { forgotPasswordAction } from '../actions/auth-actions';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    const formData = new FormData();
    formData.set('email', values.email);

    const result = await forgotPasswordAction(formData);
    setIsLoading(false);

    if (result.success) {
      setEmailSent(true);
      toast.success(
        'Si un compte existe avec cet email, un lien de reinitialisation a ete envoye.',
      );
    } else {
      toast.error(result.error ?? 'Erreur');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe oublie</CardTitle>
        <CardDescription>
          {emailSent
            ? 'Verifiez votre boite mail pour reinitialiser votre mot de passe.'
            : 'Entrez votre email pour recevoir un lien de reinitialisation.'}
        </CardDescription>
      </CardHeader>
      {!emailSent && (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@entreprise.com"
                disabled={isLoading}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer le lien
            </Button>
          </CardFooter>
        </form>
      )}
      <CardFooter>
        <Link
          href="/login"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour a la connexion
        </Link>
      </CardFooter>
    </Card>
  );
}
