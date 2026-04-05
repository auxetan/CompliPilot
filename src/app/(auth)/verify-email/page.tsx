import type { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Verifiez votre email',
};

export default function VerifyEmailPage() {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="h-7 w-7 text-primary" />
        </div>
        <CardTitle>Verifiez votre boite mail</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Nous vous avons envoye un email de confirmation. Cliquez sur le lien dans l&apos;email
          pour activer votre compte.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Vous ne trouvez pas l&apos;email ? Verifiez votre dossier spam.
        </p>
      </CardContent>
      <CardFooter className="justify-center">
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
