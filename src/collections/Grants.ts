import type { CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const Grants: CollectionConfig = {
  slug: 'grants',
  labels: { singular: 'Research grant', plural: 'Research grants' },
  admin: {
    group: 'Research',
    useAsTitle: 'title',
    defaultColumns: ['title', 'role', 'funder', 'startYear'],
  },
  access: adminCrud,
  hooks: revalidateHooks,
  defaultSort: '-startYear',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'pi',
          options: [
            { label: 'Principal Investigator', value: 'pi' },
            { label: 'Co-Investigator', value: 'coi' },
            { label: 'Member', value: 'member' },
          ],
        },
        { name: 'funder', type: 'text', required: true },
        { name: 'funderUrl', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'amount', type: 'text', admin: { description: 'e.g. RM 36,500 (USD 7,800)' } },
        { name: 'period', type: 'text', admin: { description: 'e.g. Nov 2022 – Oct 2023' } },
        { name: 'startYear', type: 'number', required: true },
      ],
    },
    { name: 'summary', type: 'textarea' },
  ],
}
