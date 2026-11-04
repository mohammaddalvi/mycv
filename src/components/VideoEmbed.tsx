'use client'

import { useState } from 'react'
import { PlayIcon } from './Icons'

const parse = (url: string): { provider: 'youtube' | 'vimeo'; id: string } | null => {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\.|^m\./, '')
    if (host === 'youtu.be') return { provider: 'youtube', id: u.pathname.slice(1) }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop()
      return id ? { provider: 'youtube', id } : null
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).find((s) => /^\d+$/.test(s))
      return id ? { provider: 'vimeo', id } : null
    }
  } catch {}
  return null
}

/** Lightweight embed: shows a poster first and loads the player only when clicked. */
export function VideoEmbed({ url, caption }: { url: string; caption?: string | null }) {
  const [active, setActive] = useState(false)
  const v = parse(url)
  if (!v)
    return (
      <p>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {caption || url}
        </a>
      </p>
    )

  const src =
    v.provider === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${v.id}?autoplay=1&dnt=1`

  return (
    <figure className="not-prose my-8">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        {active ? (
          <iframe
            src={src}
            title={caption || 'Embedded video'}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="group absolute inset-0 grid place-items-center"
            aria-label={`Play video${caption ? `: ${caption}` : ''}`}
          >
            {v.provider === 'youtube' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-90 transition group-hover:opacity-100"
              />
            )}
            <span className="relative grid size-16 place-items-center rounded-full bg-white/95 text-black shadow-lg transition group-hover:scale-105">
              <PlayIcon className="ml-1 size-7" />
            </span>
          </button>
        )}
      </div>
      {caption && <figcaption className="mt-2 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  )
}
