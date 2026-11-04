import type { CollectionBeforeValidateHook } from 'payload'

/** Fills in the slug from the title when it is empty (e.g. API or quick creates). */
export const ensureSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (data && !data.slug && typeof data.title === 'string') {
    data.slug = data.title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  return data
}
