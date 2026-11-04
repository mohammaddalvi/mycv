import { getPosts, getProfile } from '@/lib/payload'
import { SITE_URL, fullName } from '@/lib/utils'

export const revalidate = 3600

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const [posts, p] = await Promise.all([getPosts(50), getProfile()])
  const items = posts
    .map(
      (post) => `<item>
  <title>${esc(post.title)}</title>
  <link>${SITE_URL}/blog/${post.slug}</link>
  <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
  ${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ''}
  <description>${esc(post.excerpt || '')}</description>
  ${(post.tags || []).map((t) => `<category>${esc(t)}</category>`).join('')}
</item>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(`${fullName(p)} · Blog`)}</title>
  <link>${SITE_URL}/blog</link>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
  <description>${esc(p.metaDescription || '')}</description>
  <language>en</language>
${items}
</channel>
</rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
