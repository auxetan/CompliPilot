import { Clock, Building2, ScanLine, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LinkButton } from '@/components/shared/link-button';

const STATS = [
  { value: '500+', label: 'entreprises' },
  { value: '15 000+', label: 'outils scannes' },
  { value: '99.2%', label: 'de conformite' },
] as const;

/**
 * Hero section — main headline, CTAs, deadline badge, stats.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        {/* Deadline badge */}
        <Badge
          variant="outline"
          className="mb-6 gap-1.5 border-warning/30 bg-warning/5 px-3 py-1 text-warning"
        >
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Deadline EU AI Act : 2 aout 2026
        </Badge>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Mettez votre entreprise en conformite IA{' '}
          <span className="text-primary">en quelques clics</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          CompliPilot scanne vos outils IA, evalue les risques, et genere automatiquement toute la
          documentation requise par l&apos;EU AI Act, le RGPD, NIS2 et DORA.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LinkButton href="/register" size="lg" className="px-8">
            Commencer gratuitement
          </LinkButton>
          <LinkButton href="/#how-it-works" variant="outline" size="lg" className="px-8">
            Voir la demo
          </LinkButton>
        </div>

        {/* Dashboard placeholder */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-destructive/60" />
            <div className="h-3 w-3 rounded-full bg-warning/60" />
            <div className="h-3 w-3 rounded-full bg-success/60" />
          </div>
          <div className="flex items-center justify-center gap-8 px-8 py-16">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <span className="text-2xl font-semibold text-primary">87%</span>
              <span className="text-xs text-muted-foreground">Score conformite</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <ScanLine className="h-8 w-8 text-success" aria-hidden="true" />
              </div>
              <span className="text-2xl font-semibold text-success">12</span>
              <span className="text-xs text-muted-foreground">Outils scannes</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <Building2 className="h-8 w-8 text-accent" aria-hidden="true" />
              </div>
              <span className="text-2xl font-semibold text-accent">8</span>
              <span className="text-xs text-muted-foreground">Documents generes</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-semibold sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
