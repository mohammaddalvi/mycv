import type { CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: { singular: 'Teaching resource', plural: 'Teaching resources' },
  admin: {
    group: 'Teaching',
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'course', 'updatedAt'],
    description:
      'Upload slides, lecture notes, datasets, assignments, etc. Attach a file, a link, or both.',
  },
  access: adminCrud,
  hooks: revalidateHooks,
  defaultSort: '-updatedAt',
  upload: {
    staticDir: 'uploads/resources',
    filesRequiredOnCreate: false,
    mimeTypes: [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'text/plain',
      'text/x-python',
      'application/x-ipynb+json',
      'application/json',
      'image/*',
      'video/mp4',
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'slides',
          options: [
            { label: 'Lecture slides', value: 'slides' },
            { label: 'Lecture notes', value: 'notes' },
            { label: 'Tutorial / lab', value: 'tutorial' },
            { label: 'Assignment', value: 'assignment' },
            { label: 'Dataset', value: 'dataset' },
            { label: 'Code / notebook', value: 'code' },
            { label: 'Reading', value: 'reading' },
            { label: 'Video', value: 'video' },
            { label: 'Template / tool', value: 'tool' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'course',
          type: 'relationship',
          relationTo: 'courses',
          admin: { description: 'Optional: group under a course.' },
        },
      ],
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'External link',
      admin: { description: 'Use instead of (or in addition to) an uploaded file, e.g. a GitHub or Drive link.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: { position: 'sidebar' },
    },
  ],
}
