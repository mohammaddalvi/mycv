import type { CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const activityKinds = [
  { label: 'Keynote / invited talk', value: 'keynote' },
  { label: 'Workshop delivered', value: 'workshop' },
  { label: 'Training / certificate', value: 'training' },
  { label: 'Professional affiliation', value: 'affiliation' },
  { label: 'Conference organisation', value: 'organiser' },
  { label: 'Journal reviewing', value: 'reviewer' },
  { label: 'Award / honour', value: 'award' },
] as const

export const Activities: CollectionConfig = {
  slug: 'activities',
  labels: { singular: 'Talk, service or award', plural: 'Talks, service & awards' },
  admin: {
    group: 'Career',
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'organization', 'date'],
  },
  access: adminCrud,
  hooks: revalidateHooks,
  defaultSort: '-sortDate',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'kind', type: 'select', required: true, options: [...activityKinds] },
        { name: 'organization', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'date', type: 'text', admin: { description: 'As displayed, e.g. "May 2024" or "2022 – Present"' } },
        {
          name: 'sortDate',
          type: 'date',
          admin: { description: 'Used for ordering', date: { pickerAppearance: 'monthOnly' } },
        },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'url', type: 'text' },
  ],
}
