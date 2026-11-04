import type { Metadata } from 'next'
import Link from 'next/link'
import { PostCard } from '@/components/PostCard'
import { Empty, PageHeader } from '@/components/ui'
import { getPosts } from '@/lib/payload'
import { slugify } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles and notes on blockchain, generative AI, business analytics, green IS and academic life.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const posts = await getPosts()
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags || []))).sort()
  return (
    <>
      <PageHeader eyebrow="Blog" title="Articles & notes" intro="Informative articles, research explainers and news.">
        {tags.length ? (
          <nav aria-label="Tags" className="mt-8 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link key={t} href={`/blog/tag/${slugify(t)}`} className="chip hover:border-accent hover:text-accent">
                #{t}
              </Link>
            ))}
          </nav>
        ) : null}
      </PageHeader>
      <div className="container-x py-12">
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <Empty>No posts yet. Check back soon.</Empty>
        )}
      </div>
    </>
  )
}
