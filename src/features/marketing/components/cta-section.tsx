import { ArrowRight } from 'lucide-react';
import { LinkButton } from '@/components/shared/link-button';

/**
 * Final CTA section — deadline urgency + large CTA button.
 */
export function CtaSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          La deadline approche. <span className="text-primary">Soyez pret.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          L&apos;EU AI Act entre en vigueur le 2 aout 2026. Ne laissez pas votre entreprise prendre
          du retard sur la conformite.
        </p>
        <div className="mt-8">
          <LinkButton href="/register" size="lg" className="gap-2 px-8">
            Commencer maintenant — c&apos;est gratuit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
