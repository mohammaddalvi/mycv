import type { CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const Supervisions: CollectionConfig = {
  slug: 'supervisions',
  labels: { singular: 'Supervised thesis', plural: 'Supervision' },
  admin: {
    group: 'Teaching',
    useAsTitle: 'title',
    defaultColumns: ['title', 'student', 'degree', 'year', 'status'],
  },
  access: adminCrud,
  hooks: revalidateHooks,
  defaultSort: '-year',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'student', type: 'text', required: true },
        {
          name: 'degree',
          type: 'select',
          required: true,
          defaultValue: 'masters',
          options: [
            { label: 'PhD', value: 'phd' },
            { label: "Master's", value: 'masters' },
            { label: 'Undergraduate', value: 'undergraduate' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'institution', type: 'text' },
        { name: 'year', type: 'number', required: true },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'completed',
          options: [
            { label: 'Completed', value: 'completed' },
            { label: 'Ongoing', value: 'ongoing' },
          ],
        },
      ],
    },
  ],
}
