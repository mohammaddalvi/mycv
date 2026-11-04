import type { Publication } from '@/payload-types'

export const PUB_TYPES: { value: Publication['type']; label: string; plural: string }[] = [
  { value: 'journal', label: 'Journal article', plural: 'Journal articles' },
  { value: 'conference', label: 'Conference paper', plural: 'Conference papers' },
  { value: 'book', label: 'Book', plural: 'Books' },
  { value: 'chapter', label: 'Book chapter', plural: 'Book chapters' },
  { value: 'preprint', label: 'Preprint', plural: 'Preprints & working papers' },
  { value: 'thesis', label: 'Thesis', plural: 'Theses' },
  { value: 'report', label: 'Report', plural: 'Reports' },
  { value: 'other', label: 'Other', plural: 'Other' },
]

export const publicationTypeLabel = (t: Publication['type']) => PUB_TYPES.find((x) => x.value === t)?.label ?? t

const bibType: Record<Publication['type'], string> = {
  journal: 'article',
  conference: 'inproceedings',
  book: 'book',
  chapter: 'incollection',
  preprint: 'unpublished',
  thesis: 'phdthesis',
  report: 'techreport',
  other: 'misc',
}

export function toBibTeX(p: Publication) {
  const firstAuthor = (p.authors.split(',')[0] || 'pub').replace(/[^A-Za-z]/g, '')
  const firstWord = (p.title.split(/\s+/).find((w) => w.length > 3) || 'paper').replace(/[^A-Za-z]/g, '')
  const key = `${firstAuthor}${p.year}${firstWord}`.toLowerCase()
  const authors = p.authors
    .replace(/,?\s*&\s*/g, ', ')
    .replace(/…|\.\.\./g, '')
    .split(/,\s*(?=[A-Z][a-z\-‐]+,)/)
    .map((a) => a.trim().replace(/,$/, ''))
    .filter(Boolean)
    .join(' and ')
  const venueField = p.type === 'journal' ? 'journal' : p.type === 'conference' || p.type === 'chapter' ? 'booktitle' : 'publisher'
  const fields: [string, string | number | null | undefined][] = [
    ['title', p.title],
    ['author', authors],
    [venueField, p.venue],
    ['year', p.year],
    ['volume', p.volume],
    ['number', p.issue],
    ['pages', p.pages?.replace(/-/g, '--')],
    ['doi', p.doi],
    ['url', p.url],
  ]
  return `@${bibType[p.type]}{${key},\n${fields
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(',\n')}\n}`
}

export function toAPA(p: Publication) {
  let s = `${p.authors} (${p.year}). ${p.title}.`
  if (p.venue) s += ` ${p.venue}`
  if (p.volume) s += `, ${p.volume}`
  if (p.issue) s += `(${p.issue})`
  if (p.pages) s += `, ${p.pages}`
  s += '.'
  if (p.doi) s += ` https://doi.org/${p.doi}`
  return s
}
