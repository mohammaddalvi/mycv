/**
 * Seeds the database with the content of the CV.
 * Run with:  pnpm seed          (adds content only if the database is empty)
 *            SEED_FRESH=1 pnpm seed  (wipes CV content collections first)
 * Optionally set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first admin user.
 */
import 'dotenv/config'
import { getPayload, type CollectionSlug } from 'payload'
import config from '@payload-config'
import { activities, courses, education, experiences, grants, profile, projects, supervisions } from './content'
import { publications } from './publications'

const para = (text: string) => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }],
})
const heading = (text: string, tag: 'h2' | 'h3' = 'h2') => ({ ...para(text), type: 'heading', tag })
const richText = (nodes: unknown[]) => ({
  root: { type: 'root', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, children: nodes },
})

const ctx = { disableRevalidate: true }

async function run() {
  const payload = await getPayload({ config })
  const fresh = process.argv.includes('--fresh') || process.env.SEED_FRESH === '1'
  const slugs: CollectionSlug[] = ['publications', 'experiences', 'education', 'grants', 'projects', 'courses', 'activities', 'supervisions']

  if (!fresh) {
    const { totalDocs } = await payload.count({ collection: 'publications' })
    if (totalDocs > 0) {
      payload.logger.info('Database already has content. Set SEED_FRESH=1 to re-seed.')
      process.exit(0)
    }
  } else {
    for (const collection of slugs) await payload.delete({ collection, where: { id: { exists: true } }, context: ctx })
    await payload.delete({ collection: 'posts', where: { slug: { equals: 'welcome' } }, context: ctx })
  }

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    const existing = await payload.find({ collection: 'users', where: { email: { equals: email } } })
    if (!existing.totalDocs) {
      await payload.create({ collection: 'users', data: { email, password, name: profile.name } })
      payload.logger.info(`Created admin user ${email}`)
    }
  }

  await payload.updateGlobal({
    slug: 'profile',
    context: ctx,
    data: {
      ...profile,
      bio: richText(profile.bio.map(para)) as never,
      links: profile.links as never,
    },
  })

  const create = async (collection: CollectionSlug, items: Record<string, unknown>[]) => {
    for (const data of items) await payload.create({ collection, data: data as never, context: ctx })
    payload.logger.info(`Seeded ${items.length} ${collection}`)
  }

  await create('publications', publications)
  await create(
    'experiences',
    experiences.map((e) => ({ ...e, highlights: e.highlights.map((text) => ({ text })) })),
  )
  await create('education', education)
  await create('grants', grants)
  await create(
    'projects',
    projects.map((p) => ({
      ...p,
      responsibilities: p.responsibilities.map((text) => ({ text })),
      achievements: p.achievements.map((text) => ({ text })),
    })),
  )
  await create(
    'courses',
    courses.map((c, i) => ({
      ...c,
      slug: c.title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      order: i + 1, level: c.status === 'taught' ? 'both' : undefined })),
  )
  await create('activities', activities)
  await create('supervisions', supervisions)

  const existingWelcome = await payload.count({ collection: 'posts', where: { slug: { equals: 'welcome' } } })
  if (!existingWelcome.totalDocs) {
    await payload.create({
      collection: 'posts',
      context: ctx,
      data: {
        title: 'Welcome to my new website',
        slug: 'welcome',
        generateSlug: false,
        _status: 'published',
        publishedAt: new Date().toISOString(),
        excerpt: 'A short introduction to this site: where to find my research, teaching materials and upcoming articles.',
        tags: ['news'],
        content: richText([
          para('Welcome! This site brings together my research, teaching and writing in one place.'),
          heading('What you will find here'),
          para('The Publications page lists my journal articles and conference papers, which you can filter by type and year. The Teaching page describes the courses I teach, and the Resources page hosts lecture slides, datasets and other materials for students.'),
          para('On this blog I will share short articles on blockchain, generative AI, business analytics and sustainable information systems, along with news about talks and new papers.'),
          para('Thank you for visiting.'),
        ]) as never,
      } as never,
    })
    payload.logger.info('Seeded welcome post')
  }

  payload.logger.info('Done.')
  process.exit(0)
}

// `payload run` waits only for top-level awaits, so await here.
try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
