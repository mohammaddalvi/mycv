import Image from 'next/image'
import type { Media } from '@/payload-types'
import { asMedia, cx, mediaUrl } from '@/lib/utils'

type Props = {
  media: unknown
  sizes?: string
  className?: string
  priority?: boolean
  fill?: boolean
  size?: 'thumbnail' | 'card' | 'large'
}

/** Renders a Payload media document with next/image (responsive, lazy, modern formats). */
export function MediaImage({ media, sizes = '100vw', className, priority, fill, size }: Props) {
  const m = asMedia(media) as Media | null
  if (!m?.url || !m.mimeType?.startsWith('image')) return null
  const variant = size ? m.sizes?.[size] : null
  const src = mediaUrl(variant?.url || m.url)
  const width = variant?.width || m.width || 1200
  const height = variant?.height || m.height || 800
  const focal = m.focalX != null && m.focalY != null ? `${m.focalX}% ${m.focalY}%` : undefined

  if (fill)
    return (
      <Image
        src={src}
        alt={m.alt || ''}
        fill
        sizes={sizes}
        priority={priority}
        className={cx('object-cover', className)}
        style={focal ? { objectPosition: focal } : undefined}
      />
    )
  return (
    <Image src={src} alt={m.alt || ''} width={width} height={height} sizes={sizes} priority={priority} className={className} />
  )
}
