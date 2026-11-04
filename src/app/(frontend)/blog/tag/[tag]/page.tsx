import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/PostCard'
import { PageHeader } from '@/components/ui'
import { getPosts } from '@/lib/payload'
import { slugify } from '@/lib/utils'

type Props = { params: Promise<{ tag: string }> }

export async function generateStaticParams() {
  const posts = await getPosts()
  return Array.from(new Set(posts.flatMap((p) => p.tags || []).map(slugify))).map((tag) => ({ tag }))
}

const resolve = async (slug: string) => {
  const posts = await getPosts()
  const tag = posts.flatMap((p) => p.tags || []).find((t) => slugify(t) === slug)
  return { tag, posts: tag ? posts.filter((p) => p.tags?.includes(tag)) : [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await resolve((await params).tag)
  return tag ? { title: `Posts tagged “${tag}”`, alternates: { canonical: `/blog/tag/${slugify(tag)}` } } : {}
}

export default async function TagPage({ params }: Props) {
  const { tag, posts } = await resolve((await params).tag)
  if (!tag) notFound()
  return (
    <>
      <PageHeader eyebrow="Blog" title={`#${tag}`} intro={`${posts.length} post${posts.length === 1 ? '' : 's'}`}>
        <p className="mt-6 text-sm">
          <Link href="/blog" className="link">
            ← All posts
          </Link>
        </p>
      </PageHeader>
      <div className="container-x grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </>
  )
}
