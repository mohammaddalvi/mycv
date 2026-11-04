import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui'
import { ResourceBrowser } from '@/components/ResourceBrowser'
import { getResources } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Teaching resources',
  description: 'Lecture slides, notes, datasets, code and other teaching materials for students.',
  alternates: { canonical: '/resources' },
}

export default async function ResourcesPage() {
  const resources = await getResources()
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Teaching resources"
        intro="Slides, lecture notes, datasets, code and readings for my courses. Materials are free to use for learning; please cite when reusing."
      />
      <div className="container-x py-10">
        <ResourceBrowser resources={resources} />
      </div>
    </>
  )
}
