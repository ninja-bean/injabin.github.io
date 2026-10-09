import type { Metadata } from 'next';
import { Jost, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/ui/Header';
import { SkipLink } from '@/components/ui/SkipLink';
import { siteConfig } from '@/content';

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://injabin.is-a.dev'),
  title: {
    default: `${siteConfig.name} | ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.headline,
  keywords: [
    'Injabin Alam',
    'Software Engineer',
    'Full-Stack Developer',
    'Backend Systems',
    'Next.js',
    'TypeScript',
    'React Three Fiber',
    'Bauhaus Portfolio',
    'UIU CSE',
  ],
  authors: [{ name: siteConfig.name, url: 'https://injabin.is-a.dev' }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://injabin.is-a.dev',
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.headline,
    siteName: `${siteConfig.name} Portfolio`,
    images: [
      {
        url: '/avatar.png',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Software Engineer`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.headline,
    images: ['/avatar.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
};

const jsonLdPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  jobTitle: siteConfig.role,
  url: 'https://injabin.is-a.dev',
  email: `mailto:${siteConfig.email}`,
  sameAs: [
    siteConfig.github.url,
    siteConfig.linkedin.url,
    siteConfig.hackerRank.url,
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'United International University',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        {/* Prevent flash of unstyled theme / mono mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const raw = localStorage.getItem('injabin-portfolio-settings');
                if (raw) {
                  const parsed = JSON.parse(raw);
                  if (parsed?.state?.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                  if (parsed?.state?.isMono) {
                    document.documentElement.setAttribute('data-mono', 'true');
                  }
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-paper text-ink selection:bg-blue selection:text-white transition-colors duration-150 antialiased min-h-screen flex flex-col">
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
