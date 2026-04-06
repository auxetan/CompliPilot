import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Blog | CompliPilot',
  description:
    'Articles, guides et analyses sur la conformite IA, le RGPD, NIS2, DORA et les meilleures pratiques pour les PME europeennes.',
};

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'eu-ai-act-pme-guide',
    title: "L'EU AI Act entre en vigueur : ce que les PME doivent savoir",
    excerpt:
      "Le reglement europeen sur l'intelligence artificielle impose de nouvelles obligations a partir d'aout 2026. Decouvrez les exigences cles, les echeances et les etapes concretes pour mettre votre entreprise en conformite.",
    date: '2026-03-15',
    author: 'Claire Dubois',
    readTime: '8 min',
  },
  {
    slug: 'rgpd-ia-conformite-2026',
    title: 'RGPD et IA : comment rester conforme en 2026',
    excerpt:
      "L'utilisation de l'IA souleve des questions specifiques en matiere de protection des donnees. Analyses d'impact, base legale, transparence algorithmique : les points de vigilance pour concilier innovation et respect du RGPD.",
    date: '2026-02-28',
    author: 'Emma Rossi',
    readTime: '6 min',
  },
  {
    slug: 'classifier-outils-ia-niveau-risque',
    title: 'Guide pratique : classifier vos outils IA selon le niveau de risque',
    excerpt:
      "L'EU AI Act definit quatre niveaux de risque pour les systemes d'IA. Ce guide pas a pas vous aide a evaluer et classifier chacun de vos outils pour determiner les obligations applicables.",
    date: '2026-02-10',
    author: 'Lucas Schmidt',
    readTime: '10 min',
  },
];

export default function BlogPage() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Analyses, guides pratiques et actualites sur la conformite IA et les reglementations
            europeennes.
          </p>
        </div>

        {/* Posts */}
        <div className="mt-16 space-y-6">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{post.date}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.author}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readTime} de lecture</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">{post.title}</h2>
                  <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
