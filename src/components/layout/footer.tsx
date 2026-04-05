import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const FOOTER_SECTIONS = [
  {
    title: 'Produit',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Scanner IA', href: '/#features' },
      { label: 'Documentation', href: '/#features' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'A propos', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/about' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Mentions legales', href: '#' },
      { label: 'Politique de confidentialite', href: '#' },
      { label: 'CGU', href: '#' },
    ],
  },
] as const;

/**
 * Marketing site footer with multi-column links.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
              <span>CompliPilot</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              AI-Powered Compliance on Autopilot.
            </p>
          </div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CompliPilot. Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}
