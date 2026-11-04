import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui'
import { PublicationBrowser } from '@/components/PublicationBrowser'
import { JsonLd } from '@/components/ui'
import { getProfile, getPublications } from '@/lib/payload'
import { PUB_TYPES } from '@/lib/publications'
import { SITE_URL, fullName } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile()
  return {
    title: 'Publications',
    description: `Journal articles, conference papers and other publications by ${fullName(p)}, with DOIs and citations.`,
    alternates: { canonical: '/publications' },
  }
}

export default async function PublicationsPage() {
  const [p, pubs] = await Promise.all([getProfile(), getPublications()])
  const counts = PUB_TYPES.map((t) => ({ ...t, count: pubs.filter((x) => x.type === t.value).length })).filter((t) => t.count)
  const scholar = p.links?.find((l) => l.platform === 'Google Scholar')

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Publications"
        intro={
          <>
            {pubs.length} publications{counts.length > 1 && <> including {counts.map((c) => `${c.count} ${c.plural.toLowerCase()}`).join(' and ')}</>}.
            {scholar && (
              <>
                {' '}
                For citation metrics, see my{' '}
                <a href={scholar.url} className="link" target="_blank" rel="noopener noreferrer">
                  Google Scholar profile
                </a>
                .
              </>
            )}
          </>
        }
      />
      <div className="container-x py-10">
        <PublicationBrowser pubs={pubs} types={counts.map(({ value, plural, count }) => ({ value, plural, count }))} authorNames={p.authorNames || []} />
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: pubs.slice(0, 50).map((x, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'ScholarlyArticle',
              headline: x.title,
              datePublished: String(x.year),
              author: x.authors,
              isPartOf: x.venue,
              ...(x.doi ? { sameAs: `https://doi.org/${x.doi}` } : {}),
              url: `${SITE_URL}/publications#pub-${x.id}`,
            },
          })),
        }}
      />
    </>
  )
}
