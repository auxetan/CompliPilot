import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CompliPilot — AI-Powered Compliance on Autopilot',
    template: '%s | CompliPilot',
  },
  description:
    'CompliPilot aide les PME a se mettre en conformite avec les reglementations IA : EU AI Act, RGPD, NIS2, DORA. Scanner IA, classification des risques, generation automatique de documents.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'CompliPilot',
    title: 'CompliPilot — AI-Powered Compliance on Autopilot',
    description:
      'Scannez vos outils IA, evaluez les risques, generez votre documentation de conformite automatiquement.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CompliPilot — AI-Powered Compliance on Autopilot',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
