import type { Metadata } from 'next';
import { ShieldCheck, Target, Lock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const metadata: Metadata = {
  title: 'A propos',
  description:
    'Decouvrez la mission de CompliPilot : rendre la conformite IA accessible a toutes les PME europeennes.',
};

const VALUES = [
  {
    icon: Target,
    title: 'Mission',
    description:
      'Rendre la conformite IA accessible, automatisee et abordable pour chaque PME en Europe.',
  },
  {
    icon: Lock,
    title: 'Securite',
    description:
      'Vos donnees sont hebergees en Europe, chiffrees, et jamais partagees. Nous sommes nous-memes conformes au RGPD.',
  },
  {
    icon: Users,
    title: 'Transparence',
    description: 'Tarifs clairs, documentation ouverte, roadmap publique. Pas de surprises.',
  },
] as const;

const TEAM = [
  { name: 'Alexandre Martin', role: 'CEO & Co-founder', initials: 'AM' },
  { name: 'Claire Dubois', role: 'CTO & Co-founder', initials: 'CD' },
  { name: 'Lucas Schmidt', role: 'Head of AI', initials: 'LS' },
  { name: 'Emma Rossi', role: 'Head of Legal', initials: 'ER' },
] as const;

export default function AboutPage() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            A propos de CompliPilot
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Nous croyons que la conformite IA ne devrait pas etre un privilege reserve aux grandes
            entreprises. CompliPilot automatise tout le processus pour que les PME puissent se
            concentrer sur leur coeur de metier.
          </p>
        </div>

        {/* Values */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {VALUES.map((value) => (
            <Card key={value.title} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team */}
        <div className="mt-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">Notre equipe</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Une equipe pluridisciplinaire unissant expertise tech, IA et droit europeen.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <Avatar className="mx-auto h-20 w-20">
                  <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-20 rounded-xl border border-border bg-card p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold">Contactez-nous</h2>
          <p className="mt-2 text-muted-foreground">
            Une question ? Un besoin specifique ? Notre equipe est la pour vous aider.
          </p>
          <p className="mt-4 font-medium text-primary">contact@complipilot.com</p>
        </div>
      </div>
    </div>
  );
}
