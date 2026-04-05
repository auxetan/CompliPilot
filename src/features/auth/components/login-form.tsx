'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Mail } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';

import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { loginAction, magicLinkAction, googleOAuthAction } from '../actions/auth-actions';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    const formData = new FormData();
    formData.set('email', values.email);
    formData.set('password', values.password);

    const result = await loginAction(formData);
    setIsLoading(false);

    if (result.success && result.redirectTo) {
      router.push(result.redirectTo);
      router.refresh();
    } else {
      toast.error(result.error ?? 'Erreur de connexion');
    }
  }

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData(e.currentTarget);

    const result = await magicLinkAction(data);
    setIsLoading(false);

    if (result.success) {
      setMagicLinkSent(true);
      toast.success('Lien de connexion envoye ! Verifiez votre boite mail.');
    } else {
      toast.error(result.error ?? "Erreur lors de l'envoi");
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    const result = await googleOAuthAction();
    if (result.success && result.redirectTo) {
      window.location.href = result.redirectTo;
    } else {
      setIsLoading(false);
      toast.error(result.error ?? 'Erreur Google OAuth');
    }
  }

  if (showMagicLink) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connexion par Magic Link</CardTitle>
          <CardDescription>
            {magicLinkSent
              ? 'Un lien de connexion a ete envoye a votre adresse email.'
              : 'Entrez votre email pour recevoir un lien de connexion.'}
          </CardDescription>
        </CardHeader>
        {!magicLinkSent && (
          <form onSubmit={handleMagicLink}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="magic-email">Email</Label>
                <Input
                  id="magic-email"
                  name="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer le lien
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowMagicLink(false)}
              >
                Retour a la connexion classique
              </Button>
            </CardFooter>
          </form>
        )}
        {magicLinkSent && (
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setShowMagicLink(false);
                setMagicLinkSent(false);
              }}
            >
              Retour a la connexion
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous a votre compte CompliPilot.</CardDescription>
      </CardHeader>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Mot de passe oublie ?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>

          <div className="relative w-full">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              ou
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Connexion avec Google
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setShowMagicLink(true)}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Magic Link
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Creer un compte
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
