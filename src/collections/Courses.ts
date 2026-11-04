import { slugField, type CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'
import { ensureSlug } from '@/hooks/ensureSlug'
import { simpleEditor } from '@/lib/editor'

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: { singular: 'Course', plural: 'Courses' },
  admin: {
    group: 'Teaching',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'level', 'order'],
  },
  access: adminCrud,
  hooks: { ...revalidateHooks, beforeValidate: [ensureSlug] },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'taught',
          options: [
            { label: 'Taught', value: 'taught' },
            { label: 'Can teach', value: 'canTeach' },
          ],
        },
        {
          name: 'level',
          type: 'select',
          options: [
            { label: 'Undergraduate', value: 'undergraduate' },
            { label: 'Postgraduate', value: 'postgraduate' },
            { label: 'Undergraduate & Postgraduate', value: 'both' },
          ],
        },
        { name: 'code', type: 'text', label: 'Course code' },
      ],
    },
    { name: 'institutions', type: 'text', admin: { description: 'Where it was taught.' } },
    { name: 'summary', type: 'textarea' },
    {
      name: 'topics',
      type: 'text',
      hasMany: true,
      admin: { description: 'Press Enter after each topic.' },
    },
    { name: 'details', type: 'richText', editor: simpleEditor },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
