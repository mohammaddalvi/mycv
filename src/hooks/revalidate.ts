import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * Pages are statically generated. Whenever content changes in the dashboard
 * we purge the cache for the whole site so the change appears immediately.
 * The site is small, so a full purge is cheap and keeps things simple.
 */
const purge = (req: { context?: Record<string, unknown>; payload: { logger: { info: (m: string) => void } } }) => {
  if (req.context?.disableRevalidate) return
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside Next.js (e.g. seed script) – nothing to purge.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  purge(req)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  purge(req)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  purge(req)
  return doc
}

export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
