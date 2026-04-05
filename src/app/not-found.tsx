import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted-foreground">Page introuvable.</p>
      <Link href="/" className="text-primary underline-offset-4 hover:underline">
        Retour a l&apos;accueil
      </Link>
    </div>
  );
}
