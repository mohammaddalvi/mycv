import type { Access } from 'payload'

export const anyone: Access = () => true
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Logged-in users see everything, visitors only see published documents. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

export const adminCrud = {
  read: anyone,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
}
