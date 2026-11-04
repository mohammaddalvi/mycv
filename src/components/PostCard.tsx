import Link from 'next/link'
import type { Post } from '@/payload-types'
import { MediaImage } from './MediaImage'
import { ClockIcon } from './Icons'
import { formatDate } from '@/lib/utils'

type CardPost = Pick<Post, 'title' | 'slug' | 'excerpt' | 'coverImage' | 'publishedAt' | 'tags' | 'readingTime'>

export function PostCard({ post, priority }: { post: CardPost; priority?: boolean }) {
  return (
    <article className="card group relative flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-accent-soft" tabIndex={-1} aria-hidden>
        {post.coverImage ? (
          <MediaImage media={post.coverImage} fill size="card" sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" priority={priority} className="transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent/20 via-accent-soft to-gold/10">
            <span className="px-6 text-center font-serif text-xl font-semibold text-accent/80">{post.title}</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-3 text-xs text-muted">
          <time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time>
          {post.readingTime ? (
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="size-3.5" /> {post.readingTime} min read
            </span>
          ) : null}
        </div>
        <h3 className="font-serif text-xl font-semibold leading-snug text-ink">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 hover:text-accent">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>}
        {post.tags?.length ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="chip !py-0.5">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
