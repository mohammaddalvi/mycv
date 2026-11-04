import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import './styles.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { themeScript } from '@/components/ThemeToggle'
import { JsonLd } from '@/components/ui'
import { getProfile } from '@/lib/payload'
import { SITE_URL, absoluteUrl, asMedia, fullName } from '@/lib/utils'

const inter = localFont({
  src: '../../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})
const serif = localFont({
  src: [
    { path: '../../../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2', style: 'normal' },
    { path: '../../../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-italic.woff2', style: 'italic' },
  ],
  variable: '--font-serif4',
  display: 'swap',
  weight: '200 900',
})

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile()
  const title = p.siteTitle || fullName(p)
  const og = asMedia(p.ogImage) || asMedia(p.photo)
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${p.name}` },
    description: p.metaDescription || p.intro || undefined,
    keywords: p.keywords || undefined,
    authors: [{ name: fullName(p), url: SITE_URL }],
    creator: p.name,
    alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
    openGraph: {
      type: 'website',
      siteName: fullName(p),
      title,
      description: p.metaDescription || undefined,
      url: SITE_URL,
      locale: 'en_GB',
      ...(og?.url ? { images: [{ url: absoluteUrl(og.url), width: og.width || undefined, height: og.height || undefined }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description: p.metaDescription || undefined },
    icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon.svg', type: 'image/svg+xml' }], apple: '/apple-touch-icon.png' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#0c131a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const p = await getProfile()
  const initials = (p.name || 'Me')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
  const photo = asMedia(p.photo)
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: fullName(p),
            givenName: p.name?.split(' ')[0],
            honorificPrefix: p.honorific || undefined,
            jobTitle: p.headline || undefined,
            url: SITE_URL,
            email: p.email ? `mailto:${p.email}` : undefined,
            image: photo?.url ? absoluteUrl(photo.url) : undefined,
            sameAs: p.links?.map((l) => l.url),
            knowsAbout: p.researchInterests?.map((r) => r.title),
            worksFor: p.positions?.map((x) => ({ '@type': 'Organization', name: x.organization, url: x.url || undefined })),
          }}
        />
        <Header name={p.name} honorific={p.honorific} short={initials} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer profile={p} />
      </body>
    </html>
  )
}
