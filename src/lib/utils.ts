import type { Media, Resource } from '@/payload-types'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export const absoluteUrl = (path = '/') => (path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`)

const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
const fullDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export const formatMonth = (d?: string | null) => (d ? monthYear.format(new Date(d)) : '')
export const formatDate = (d?: string | null) => (d ? fullDate.format(new Date(d)) : '')

export const period = (start?: string | null, end?: string | null, current?: boolean | null) =>
  `${formatMonth(start)} – ${current ? 'Present' : formatMonth(end) || 'Present'}`

export const asMedia = (m: unknown): Media | null => (m && typeof m === 'object' && 'url' in m ? (m as Media) : null)
export const asResource = (m: unknown): Resource | null => (m && typeof m === 'object' && 'id' in m ? (m as Resource) : null)

export const fileSize = (bytes?: number | null) => {
  if (!bytes) return ''
  const u = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let n = bytes
  while (n >= 1024 && i < u.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${u[i]}`
}

export const fileExt = (name?: string | null) => (name?.split('.').pop() || '').toUpperCase()

export const fullName = (p: { honorific?: string | null; name?: string | null }) =>
  [p.honorific, p.name].filter(Boolean).join(' ')

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** Payload returns absolute URLs for local uploads; make same-origin ones relative so next/image can optimise them. */
export const mediaUrl = (url?: string | null) => {
  if (!url) return ''
  const server = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  if (url.startsWith(server)) return url.slice(server.length) || '/'
  return url.replace(/^https?:\/\/localhost(:\d+)?/, '')
}
