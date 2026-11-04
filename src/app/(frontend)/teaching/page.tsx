import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@/components/Icons'
import { PageHeader, Section } from '@/components/ui'
import { getCourses, getResources, getSupervisions } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Teaching',
  description: 'Courses taught in business analytics and information systems, subjects available to teach, and postgraduate thesis supervision.',
  alternates: { canonical: '/teaching' },
}

const levelLabel = { undergraduate: 'Undergraduate', postgraduate: 'Postgraduate', both: 'UG & PG' } as const
const degreeLabel = { phd: 'PhD', masters: "Master's", undergraduate: 'Undergraduate' } as const

export default async function TeachingPage() {
  const [courses, supervisions, resources] = await Promise.all([getCourses(), getSupervisions(), getResources()])
  const taught = courses.filter((c) => c.status === 'taught')
  const canTeach = courses.filter((c) => c.status === 'canTeach')
  const resourceCount = (id: number) => resources.filter((r) => (typeof r.course === 'object' ? r.course?.id : r.course) === id).length
  const years = Array.from(new Set(supervisions.map((s) => s.year))).sort((a, b) => b - a)

  return (
    <>
      <PageHeader
        eyebrow="Teaching"
        title="Teaching & supervision"
        intro="Undergraduate and postgraduate teaching in business analytics, information systems and operations, plus research supervision."
      >
        <div className="mt-8 flex flex-wrap gap-2">
          <a href="#courses" className="chip hover:border-accent hover:text-accent">Courses taught</a>
          {canTeach.length ? <a href="#can-teach" className="chip hover:border-accent hover:text-accent">Can teach</a> : null}
          {supervisions.length ? <a href="#supervision" className="chip hover:border-accent hover:text-accent">Supervision ({supervisions.length})</a> : null}
          <Link href="/resources" className="chip hover:border-accent hover:text-accent">Teaching resources →</Link>
        </div>
      </PageHeader>
      <div className="container-x">
        <Section id="courses" eyebrow="Courses" title="Courses taught">
          <div className="grid gap-5 md:grid-cols-2">
            {taught.map((c) => {
              const n = resourceCount(c.id)
              return (
                <Link key={c.id} href={`/teaching/${c.slug}`} className="card group flex flex-col p-6 transition hover:border-accent/50 hover:shadow-lg hover:shadow-black/5">
                  <div className="mb-2 flex flex-wrap gap-2 text-xs">
                    {c.code && <span className="font-semibold text-accent">{c.code}</span>}
                    {c.level && <span className="text-muted">{levelLabel[c.level]}</span>}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-ink group-hover:text-accent">{c.title}</h3>
                  {c.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{c.summary}</p>}
                  {c.topics?.length ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {c.topics.slice(0, 6).map((t) => (
                        <span key={t} className="chip !py-0.5">{t}</span>
                      ))}
                    </div>
                  ) : null}
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-accent">
                    {n ? `${n} resource${n > 1 ? 's' : ''}` : 'Course details'} <ArrowRight className="size-4" />
                  </span>
                </Link>
              )
            })}
          </div>
        </Section>

        {canTeach.length ? (
          <Section id="can-teach" eyebrow="Available" title="Subjects I can teach" className="border-t border-line">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {canTeach.map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
                  <span className="size-2 shrink-0 rounded-full bg-gold" />
                  <span className="font-medium text-ink">{c.title}</span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {supervisions.length ? (
          <Section id="supervision" eyebrow="Supervision" title={`Theses supervised (${supervisions.length})`} className="border-t border-line">
            <div className="space-y-3">
              {years.map((y, i) => {
                const items = supervisions.filter((s) => s.year === y)
                return (
                  <details key={y} className="card group overflow-hidden" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                      <span className="font-serif text-xl font-semibold text-ink">{y}</span>
                      <span className="flex items-center gap-3 text-sm text-muted">
                        {items.length} thesis{items.length > 1 ? 'es' : ''}
                        <span className="transition group-open:rotate-180">⌄</span>
                      </span>
                    </summary>
                    <ul className="divide-y divide-line border-t border-line">
                      {items.map((s) => (
                        <li key={s.id} className="px-5 py-4">
                          <p className="font-medium leading-snug text-ink">{s.title}</p>
                          <p className="mt-1 text-sm text-muted">
                            {s.student} · {degreeLabel[s.degree]}
                            {s.institution && ` · ${s.institution}`}
                            {s.status === 'ongoing' && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">Ongoing</span>}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </details>
                )
              })}
            </div>
          </Section>
        ) : null}
      </div>
    </>
  )
}
