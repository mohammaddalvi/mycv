import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getClient = cache(() => getPayload({ config }))

export const getProfile = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'profile', depth: 1 })
})

export const getPublications = cache(async () => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'publications', limit: 1000, sort: ['-year', 'title'], depth: 1 })
  return docs
})

export const getExperiences = cache(async () => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'experiences', limit: 200, sort: '-startDate' })
  return docs
})

export const getEducation = cache(async () => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'education', limit: 50, sort: '-endYear' })
  return docs
})

export const getGrants = cache(async () => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'grants', limit: 200, sort: '-startYear' })
  return docs
})

export const getProjects = cache(async () => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'projects', limit: 200, sort: '-startYear' })
  return docs
})

export const getActivities = cache(async () => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'activities', limit: 500, sort: '-sortDate' })
  return docs
})

export const getCourses = cache(async () => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'courses', limit: 200, sort: 'order' })
  return docs
})

export const getCourse = cache(async (slug: string) => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'courses', where: { slug: { equals: slug } }, limit: 1 })
  return docs[0] ?? null
})

export const getResources = cache(async () => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'resources', limit: 1000, sort: '-updatedAt', depth: 1 })
  return docs
})

export const getSupervisions = cache(async () => {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'supervisions', limit: 1000, sort: ['-year', 'student'] })
  return docs
})

export const getPosts = cache(async (limit = 200) => {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit,
    sort: '-publishedAt',
    depth: 1,
    select: { title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true, tags: true, readingTime: true, updatedAt: true },
  })
  return docs
})

export const getPost = cache(async (slug: string) => {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})
