import type { CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: { singular: 'Experience', plural: 'Experience' },
  admin: {
    group: 'Career',
    useAsTitle: 'role',
    defaultColumns: ['role', 'organization', 'category', 'startDate', 'isCurrent'],
  },
  access: adminCrud,
  hooks: revalidateHooks,
  defaultSort: '-startDate',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text', required: true },
        { name: 'organization', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'academic',
          options: [
            { label: 'Academic position', value: 'academic' },
            { label: 'Academic leadership', value: 'academicLeadership' },
            { label: 'Research leadership', value: 'researchLeadership' },
            { label: 'Industry', value: 'industry' },
          ],
        },
        { name: 'location', type: 'text' },
        { name: 'url', type: 'text', label: 'Organization website' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
            condition: (_, sibling) => !sibling?.isCurrent,
          },
        },
        { name: 'isCurrent', type: 'checkbox', label: 'Current position' },
      ],
    },
    { name: 'summary', type: 'textarea' },
    {
      name: 'highlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}
