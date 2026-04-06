import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '../page';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Article introuvable' };

  return {
    title: `${post.title} | Blog CompliPilot`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au blog
        </Link>

        {/* Article header */}
        <article className="mt-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{post.date}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{post.author}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{post.readTime} de lecture</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>

          <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
            <p>{post.excerpt}</p>
            <p>
              Cet article est en cours de redaction. Revenez bientot pour decouvrir le contenu
              complet avec des analyses detaillees, des exemples concrets et des recommandations
              pratiques pour votre entreprise.
            </p>
            <p>
              En attendant, vous pouvez utiliser le scanner IA de CompliPilot pour evaluer
              automatiquement la conformite de vos outils et obtenir des recommandations
              personnalisees.
            </p>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold">Evaluez votre conformite maintenant</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Utilisez CompliPilot pour scanner vos outils IA et obtenir un rapport de conformite
            detaille.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Commencer gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
}
