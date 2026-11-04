import type { CollectionConfig } from 'payload'
import { adminCrud } from '@/access'
import { revalidateHooks } from '@/hooks/revalidate'

export const publicationTypes = [
  { label: 'Journal article', value: 'journal' },
  { label: 'Conference paper', value: 'conference' },
  { label: 'Book', value: 'book' },
  { label: 'Book chapter', value: 'chapter' },
  { label: 'Preprint / working paper', value: 'preprint' },
  { label: 'Thesis', value: 'thesis' },
  { label: 'Report', value: 'report' },
  { label: 'Other', value: 'other' },
] as const

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Publication', plural: 'Publications' },
  admin: {
    group: 'Research',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'year', 'venue', 'featured'],
    listSearchableFields: ['title', 'authors', 'venue'],
  },
  access: adminCrud,
  hooks: revalidateHooks,
  defaultSort: '-year',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'authors',
      type: 'text',
      required: true,
      admin: { description: 'As in the citation, e.g. "Dalvi-Esfahani, M., Ramayah, T., & Nilashi, M."' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'journal',
          options: [...publicationTypes],
        },
        { name: 'year', type: 'number', required: true, min: 1950, max: 2100 },
      ],
    },
    {
      name: 'venue',
      type: 'text',
      admin: { description: 'Journal, conference, or publisher name.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'volume', type: 'text' },
        { name: 'issue', type: 'text' },
        { name: 'pages', type: 'text', admin: { description: 'Pages or article number' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'doi', type: 'text', label: 'DOI', admin: { description: 'e.g. 10.1016/j.techfore.2025.124291' } },
        { name: 'url', type: 'text', label: 'Link' },
      ],
    },
    { name: 'abstract', type: 'textarea' },
    { name: 'keywords', type: 'text', hasMany: true },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'resources',
      admin: { description: 'Optional author copy / preprint.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
    {
      name: 'note',
      type: 'text',
      admin: { position: 'sidebar', description: 'e.g. "Q1, SSCI" or "Best paper award"' },
    },
  ],
}
