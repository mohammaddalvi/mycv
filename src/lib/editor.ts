import {
  BlocksFeature,
  FixedToolbarFeature,
  HorizontalRuleFeature,
  lexicalEditor,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { Callout, Gallery, VideoEmbed } from '@/blocks'

/** Full editor for blog posts: headings, lists, links, images, video files, embeds. */
export const postEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((f) => f.key !== 'upload'),
    UploadFeature({
      collections: {
        media: { fields: [{ name: 'caption', type: 'text' }] },
      },
    }),
    FixedToolbarFeature(),
    HorizontalRuleFeature(),
    BlocksFeature({ blocks: [VideoEmbed, Gallery, Callout] }),
  ],
})

/** Lighter editor for descriptions (bio, course pages). */
export const simpleEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
})
