import type { CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo / Video', plural: 'Photos & Videos' },
  admin: {
    group: 'Library',
    description: 'Images and video files used on the site and in blog posts.',
  },
  access: adminCrud,
  hooks: revalidateHooks,
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Short description of the image for screen readers and SEO.' },
    },
    { name: 'credit', type: 'text' },
  ],
  upload: {
    staticDir: 'uploads/media',
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 432, position: 'centre' },
      { name: 'large', width: 1600 },
    ],
    adminThumbnail: 'thumbnail',
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
}
