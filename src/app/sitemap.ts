import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://complipilot.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/blog/eu-ai-act-pme-guide', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog/rgpd-ia-conformite-2026', priority: 0.7, changeFrequency: 'monthly' as const },
    {
      path: '/blog/classifier-outils-ia-niveau-risque',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    { path: '/legal/mentions-legales', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/legal/confidentialite', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/legal/cgu', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/login', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/register', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  return staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
