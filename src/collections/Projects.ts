import type { CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Consultancy project', plural: 'Consultancy projects' },
  admin: {
    group: 'Career',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'role', 'period'],
  },
  access: adminCrud,
  hooks: revalidateHooks,
  defaultSort: '-startYear',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'client', type: 'text', required: true },
        { name: 'role', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'period', type: 'text' },
        { name: 'startYear', type: 'number', required: true },
      ],
    },
    { name: 'responsibilities', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'achievements', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
  ],
}
