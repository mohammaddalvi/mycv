import type { MetadataRoute } from 'next'
import { getCourses, getPosts } from '@/lib/payload'
import { SITE_URL } from '@/lib/utils'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, courses] = await Promise.all([getPosts(), getCourses()])
  const now = new Date()
  const pages = ['', '/about', '/experience', '/publications', '/teaching', '/resources', '/blog', '/contact'].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.8,
  }))
  return [
    ...pages,
    ...courses.map((c) => ({ url: `${SITE_URL}/teaching/${c.slug}`, lastModified: new Date(c.updatedAt), priority: 0.5 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.updatedAt), priority: 0.7 })),
  ]
}
