import { slugField, type CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'
import { ensureSlug } from '@/hooks/ensureSlug'
import { postEditor } from '@/lib/editor'

/** Rough reading time from the Lexical JSON tree. */
const countWords = (node: unknown): number => {
  if (!node || typeof node !== 'object') return 0
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  let total = typeof n.text === 'string' ? n.text.split(/\s+/).filter(Boolean).length : 0
  if (n.root) total += countWords(n.root)
  if (Array.isArray(n.children)) for (const c of n.children) total += countWords(c)
  return total
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: {
    group: 'Blog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status', 'updatedAt'],
    preview: (doc) => (doc?.slug ? `/blog/${doc.slug}` : null),
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: { autosave: { interval: 2000 }, schedulePublish: true },
    maxPerDoc: 30,
  },
  defaultSort: '-publishedAt',
  hooks: {
    ...revalidateHooks,
    beforeValidate: [ensureSlug],
    beforeChange: [
      ({ data }) => {
        if (data.content) data.readingTime = Math.max(1, Math.round(countWords(data.content) / 220))
        if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              admin: { description: 'One or two sentences shown on the blog list and in Google results.' },
            },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            { name: 'content', type: 'richText', editor: postEditor, required: true },
          ],
        },
        {
          label: 'SEO',
          name: 'meta',
          fields: [
            { name: 'title', type: 'text', admin: { description: 'Defaults to the post title.' } },
            { name: 'description', type: 'textarea', admin: { description: 'Defaults to the excerpt.' } },
            { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Defaults to the cover image.' } },
          ],
        },
      ],
    },
    slugField({ position: 'sidebar' }),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Press Enter after each tag.' },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Minutes (automatic)' },
    },
  ],
}
