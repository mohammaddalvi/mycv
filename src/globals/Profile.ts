import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { simpleEditor } from '@/lib/editor'

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Profile & site settings',
  admin: { group: 'Settings' },
  access: { read: () => true, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'About me',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'honorific', type: 'text', admin: { description: 'e.g. Ts Dr' } },
                { name: 'name', type: 'text', required: true },
              ],
            },
            { name: 'headline', type: 'text', admin: { description: 'e.g. Assistant Professor of Information Systems' } },
            { name: 'photo', type: 'upload', relationTo: 'media' },
            {
              name: 'intro',
              type: 'textarea',
              admin: { description: 'Short paragraph for the home page hero.' },
            },
            { name: 'bio', type: 'richText', editor: simpleEditor, admin: { description: 'Longer biography for the About page.' } },
            {
              name: 'positions',
              type: 'array',
              labels: { singular: 'Current position', plural: 'Current positions' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'role', type: 'text', required: true },
                    { name: 'organization', type: 'text', required: true },
                    { name: 'url', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'researchInterests',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'skills',
              type: 'array',
              labels: { singular: 'Skill group', plural: 'Skill groups' },
              fields: [
                { name: 'group', type: 'text', required: true },
                { name: 'items', type: 'text', hasMany: true },
              ],
            },
            {
              name: 'yearsOfExperience',
              type: 'number',
              admin: { description: 'Shown on the home page stats strip, e.g. 10 → "10+".' },
            },
            { name: 'cv', type: 'upload', relationTo: 'resources', label: 'CV (PDF)' },
          ],
        },
        {
          label: 'Contact & links',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email' },
                { name: 'secondaryEmail', type: 'email' },
                { name: 'phone', type: 'text' },
              ],
            },
            { name: 'address', type: 'textarea' },
            {
              name: 'links',
              type: 'array',
              labels: { singular: 'Profile link', plural: 'Profile links' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: [
                        'Google Scholar',
                        'Scopus',
                        'ORCID',
                        'ResearchGate',
                        'LinkedIn',
                        'Web of Science',
                        'GitHub',
                        'X / Twitter',
                        'University profile',
                        'Other',
                      ],
                    },
                    { name: 'url', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'siteTitle', type: 'text', admin: { description: 'Shown in browser tabs and Google.' } },
            { name: 'metaDescription', type: 'textarea' },
            { name: 'keywords', type: 'text', hasMany: true },
            { name: 'ogImage', type: 'upload', relationTo: 'media', admin: { description: 'Image used when links are shared (1200×630).' } },
            {
              name: 'authorNames',
              type: 'text',
              hasMany: true,
              admin: { description: 'Name spellings to highlight in publication author lists, e.g. "Dalvi-Esfahani, M."' },
            },
          ],
        },
      ],
    },
  ],
}
