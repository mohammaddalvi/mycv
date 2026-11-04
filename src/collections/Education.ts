import type { CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const Education: CollectionConfig = {
  slug: 'education',
  labels: { singular: 'Education', plural: 'Education' },
  admin: {
    group: 'Career',
    useAsTitle: 'degree',
    defaultColumns: ['degree', 'field', 'institution', 'endYear'],
  },
  access: adminCrud,
  hooks: revalidateHooks,
  defaultSort: '-endYear',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'degree', type: 'text', required: true, admin: { description: 'e.g. PhD, MSc, Postdoc' } },
        { name: 'field', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'institution', type: 'text', required: true },
        { name: 'location', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'period', type: 'text', admin: { description: 'e.g. Jul 2011 – Aug 2015' } },
        { name: 'endYear', type: 'number', required: true, admin: { description: 'Used for ordering' } },
      ],
    },
    { name: 'thesis', type: 'text', label: 'Thesis / dissertation title' },
    { name: 'details', type: 'textarea', admin: { description: 'Supervisor, grade, notes. One per line.' } },
  ],
}
