import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { ResourceItem } from '@/components/ResourceItem'
import { Empty, JsonLd, PageHeader, Section } from '@/components/ui'
import { getCourse, getCourses, getProfile, getResources } from '@/lib/payload'
import { SITE_URL, fullName } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.filter((c) => c.slug).map((c) => ({ slug: c.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCourse((await params).slug)
  if (!c) return {}
  return { title: c.title, description: c.summary || undefined, alternates: { canonical: `/teaching/${c.slug}` } }
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const [c, resources, p] = await Promise.all([getCourse(slug), getResources(), getProfile()])
  if (!c) notFound()
  const mine = resources.filter((r) => (typeof r.course === 'object' ? r.course?.id : r.course) === c.id)

  return (
    <>
      <PageHeader eyebrow={c.status === 'taught' ? 'Course' : 'Subject I can teach'} title={c.title} intro={c.summary}>
        <p className="mt-6 text-sm text-muted">
          <Link href="/teaching" className="link">
            ← All teaching
          </Link>
          {c.institutions && <> · Taught at {c.institutions}</>}
        </p>
      </PageHeader>
      <div className="container-x">
        <div className="grid gap-12 py-12 lg:grid-cols-[1fr_18rem]">
          <div>
            {c.details ? <RichText data={c.details} /> : null}
            <Section title="Course materials" className={c.details ? '' : '!pt-0'}>
              {mine.length ? (
                <div className="grid gap-4">
                  {mine.map((r) => (
                    <ResourceItem key={r.id} r={r} showCourse={false} />
                  ))}
                </div>
              ) : (
                <Empty>Materials for this course will be posted here.</Empty>
              )}
            </Section>
          </div>
          {c.topics?.length ? (
            <aside className="card h-fit p-6">
              <p className="eyebrow mb-3">Topics covered</p>
              <ul className="space-y-2 text-sm text-ink/85">
                {c.topics.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" /> {t}
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: c.title,
          description: c.summary,
          url: `${SITE_URL}/teaching/${c.slug}`,
          provider: { '@type': 'Person', name: fullName(p) },
        }}
      />
    </>
  )
}
