import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MediaImage } from '@/components/MediaImage'
import { PostCard } from '@/components/PostCard'
import { RichText } from '@/components/RichText'
import { ShareLinks } from '@/components/ShareLinks'
import { ClockIcon } from '@/components/Icons'
import { JsonLd } from '@/components/ui'
import { getPost, getPosts, getProfile } from '@/lib/payload'
import { SITE_URL, absoluteUrl, asMedia, formatDate, fullName, slugify } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.filter((p) => p.slug).map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  const img = asMedia(post.meta?.image) || asMedia(post.coverImage)
  const title = post.meta?.title || post.title
  const description = post.meta?.description || post.excerpt || undefined
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt,
      tags: post.tags || undefined,
      ...(img?.url ? { images: [{ url: absoluteUrl(img.sizes?.large?.url || img.url), alt: img.alt || title }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [post, profile, all] = await Promise.all([getPost(slug), getProfile(), getPosts(20)])
  if (!post) notFound()
  const cover = asMedia(post.coverImage)
  const related = all
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => (b.tags || []).filter((t) => post.tags?.includes(t)).length - (a.tags || []).filter((t) => post.tags?.includes(t)).length)
    .slice(0, 3)
  const url = `${SITE_URL}/blog/${post.slug}`

  return (
    <article>
      <header className="container-x max-w-3xl pb-8 pt-12 sm:pt-16">
        <Link href="/blog" className="link text-sm">
          ← Blog
        </Link>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span className="font-medium text-ink">{fullName(profile)}</span>
          <time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time>
          {post.readingTime ? (
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="size-4" /> {post.readingTime} min read
            </span>
          ) : null}
        </div>
      </header>
      {cover && (
        <div className="container-x max-w-5xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
            <MediaImage media={cover} fill priority sizes="(min-width: 1024px) 1000px, 100vw" />
          </div>
          {cover.credit && <p className="mt-2 text-center text-xs text-muted">{cover.credit}</p>}
        </div>
      )}
      <div className="container-x max-w-3xl py-10">
        <RichText data={post.content} />
        <footer className="mt-12 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link key={t} href={`/blog/tag/${slugify(t)}`} className="chip hover:border-accent hover:text-accent">
                  #{t}
                </Link>
              ))}
            </div>
          ) : (
            <span />
          )}
          <ShareLinks url={url} title={post.title} />
        </footer>
      </div>
      {related.length ? (
        <section className="border-t border-line bg-surface/60 py-14">
          <div className="container-x">
            <h2 className="h-section mb-8">More articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          mainEntityOfPage: url,
          url,
          image: cover?.url ? absoluteUrl(cover.url) : undefined,
          keywords: post.tags?.join(', '),
          author: { '@type': 'Person', name: fullName(profile), url: SITE_URL },
        }}
      />
    </article>
  )
}
