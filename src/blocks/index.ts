import type { Block } from 'payload'

export const VideoEmbed: Block = {
  slug: 'videoEmbed',
  labels: { singular: 'Video (YouTube / Vimeo)', plural: 'Videos' },
  interfaceName: 'VideoEmbedBlock',
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'Paste a YouTube or Vimeo link, e.g. https://www.youtube.com/watch?v=…' },
    },
    { name: 'caption', type: 'text' },
  ],
}

export const Callout: Block = {
  slug: 'callout',
  labels: { singular: 'Callout box', plural: 'Callouts' },
  interfaceName: 'CalloutBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Tip', value: 'tip' },
        { label: 'Warning', value: 'warning' },
        { label: 'Key takeaway', value: 'takeaway' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
  ],
}

export const Gallery: Block = {
  slug: 'gallery',
  labels: { singular: 'Image gallery', plural: 'Galleries' },
  interfaceName: 'GalleryBlock',
  fields: [
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      filterOptions: { mimeType: { contains: 'image' } },
    },
    { name: 'caption', type: 'text' },
  ],
}
