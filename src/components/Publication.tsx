import type { ReactNode } from 'react'
import type { Publication } from '@/payload-types'
import { publicationTypeLabel } from '@/lib/publications'
import { ExternalIcon, FileIcon } from './Icons'
import { asResource } from '@/lib/utils'
import { CiteButton } from './CiteButton'

/** Bold the owner's name inside an author list. */
export function highlightAuthors(authors: string, names: string[]): ReactNode {
  const list = names.filter(Boolean).sort((a, b) => b.length - a.length)
  if (!list.length) return authors
  const esc = list.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[-‐]/g, '[-‐]'))
  const re = new RegExp(`(${esc.join('|')})`, 'g')
  return authors.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export function citationDetails(p: Pick<Publication, 'venue' | 'volume' | 'issue' | 'pages'>) {
  let s = ''
  if (p.volume) s += p.volume
  if (p.issue) s += `(${p.issue})`
  if (p.pages) s += `${s ? ', ' : ''}${p.pages}`
  return s
}

export function PublicationItem({ pub, authorNames, showType = true }: { pub: Publication; authorNames: string[]; showType?: boolean }) {
  const href = pub.doi ? `https://doi.org/${pub.doi}` : pub.url || null
  const pdf = asResource(pub.pdf)
  const details = citationDetails(pub)
  return (
    <article className="group py-5">
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
        {showType && <span className="font-semibold uppercase tracking-wider text-accent">{publicationTypeLabel(pub.type)}</span>}
        <span className="text-muted">{pub.year}</span>
        {pub.note && <span className="rounded-full bg-gold/10 px-2 py-0.5 font-medium text-gold">{pub.note}</span>}
      </div>
      <h3 className="font-serif text-lg font-semibold leading-snug text-ink">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            {pub.title}
          </a>
        ) : (
          pub.title
        )}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{highlightAuthors(pub.authors, authorNames)}</p>
      {pub.venue && (
        <p className="mt-1 text-sm text-muted">
          <em className="text-ink/85">{pub.venue}</em>
          {details && `, ${details}`}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {pub.doi && (
          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="chip hover:border-accent hover:text-accent">
            DOI <ExternalIcon className="ml-1 size-3" />
          </a>
        )}
        {!pub.doi && pub.url && (
          <a href={pub.url} target="_blank" rel="noopener noreferrer" className="chip hover:border-accent hover:text-accent">
            Link <ExternalIcon className="ml-1 size-3" />
          </a>
        )}
        {!href && (
          <a
            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(`"${pub.title}"`)}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="chip hover:border-accent hover:text-accent"
          >
            Find on Scholar <ExternalIcon className="ml-1 size-3" />
          </a>
        )}
        {pdf?.url && (
          <a href={pdf.url} className="chip hover:border-accent hover:text-accent" download>
            <FileIcon className="mr-1 size-3" /> PDF
          </a>
        )}
        <CiteButton pub={pub} />
      </div>
    </article>
  )
}
