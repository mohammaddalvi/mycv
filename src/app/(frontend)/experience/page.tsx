import type { Metadata } from 'next'
import { PageHeader, Section } from '@/components/ui'
import { ExternalIcon } from '@/components/Icons'
import { getActivities, getExperiences, getGrants, getProjects } from '@/lib/payload'
import type { Experience } from '@/payload-types'
import { period } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Academic positions, research and academic leadership, industry experience, research grants, consultancy projects, talks and workshops.',
  alternates: { canonical: '/experience' },
}

const GROUPS: { key: Experience['category']; title: string; eyebrow: string }[] = [
  { key: 'academic', title: 'Academic positions', eyebrow: 'Career' },
  { key: 'researchLeadership', title: 'Research leadership', eyebrow: 'Leadership' },
  { key: 'academicLeadership', title: 'Academic leadership', eyebrow: 'Leadership' },
  { key: 'industry', title: 'Industry', eyebrow: 'Industry' },
]

const roleLabel = { pi: 'Principal Investigator', coi: 'Co-Investigator', member: 'Member' } as const

function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative space-y-10 border-l border-line pl-8">
      {items.map((e) => (
        <li key={e.id} className="relative">
          <span className={`absolute -left-[2.4rem] top-1.5 size-3 rounded-full border-2 ${e.isCurrent ? 'border-accent bg-accent' : 'border-accent bg-paper'}`} />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>{period(e.startDate, e.endDate, e.isCurrent)}</span>
            {e.isCurrent && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">Current</span>}
          </div>
          <h3 className="mt-1 font-serif text-xl font-semibold text-ink">{e.role}</h3>
          <p className="text-muted">
            {e.url ? (
              <a href={e.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                {e.organization}
              </a>
            ) : (
              e.organization
            )}
            {e.location && `, ${e.location}`}
          </p>
          {e.summary && <p className="mt-2 text-ink/85">{e.summary}</p>}
          {e.highlights?.length ? (
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem] leading-relaxed text-ink/80 marker:text-accent">
              {e.highlights.map((h) => (
                <li key={h.id ?? h.text}>{h.text}</li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

export default async function ExperiencePage() {
  const [experiences, grants, projects, activities] = await Promise.all([getExperiences(), getGrants(), getProjects(), getActivities()])
  const talks = activities.filter((a) => a.kind === 'keynote' || a.kind === 'workshop')
  const sections = GROUPS.map((g) => ({ ...g, items: experiences.filter((e) => e.category === g.key) })).filter((g) => g.items.length)
  const jump = [
    ...sections.map((s) => ({ id: s.key, label: s.title })),
    ...(grants.length ? [{ id: 'grants', label: 'Research grants' }] : []),
    ...(projects.length ? [{ id: 'consultancy', label: 'Consultancy' }] : []),
    ...(talks.length ? [{ id: 'talks', label: 'Talks & workshops' }] : []),
  ]

  return (
    <>
      <PageHeader eyebrow="Experience" title="Career & leadership" intro="Academic appointments, research leadership, funded projects and industry collaboration.">
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
          {jump.map((j) => (
            <a key={j.id} href={`#${j.id}`} className="chip hover:border-accent hover:text-accent">
              {j.label}
            </a>
          ))}
        </nav>
      </PageHeader>
      <div className="container-x">
        {sections.map((s, i) => (
          <Section key={s.key} id={s.key} eyebrow={s.eyebrow} title={s.title} className={i ? 'border-t border-line' : ''}>
            <Timeline items={s.items} />
          </Section>
        ))}

        {grants.length ? (
          <Section id="grants" eyebrow="Funding" title="Research grants" className="border-t border-line">
            <div className="grid gap-4 md:grid-cols-2">
              {grants.map((g) => (
                <article key={g.id} className="card flex flex-col p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 font-semibold text-accent">{roleLabel[g.role]}</span>
                    {g.period && <span className="text-muted">{g.period}</span>}
                  </div>
                  <h3 className="font-serif text-lg font-semibold leading-snug text-ink">{g.title}</h3>
                  {g.summary && <p className="mt-2 text-sm text-muted">{g.summary}</p>}
                  <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 pt-4 text-sm">
                    <dt className="text-muted">Funder</dt>
                    <dd className="text-ink">
                      {g.funderUrl ? (
                        <a href={g.funderUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                          {g.funder}
                        </a>
                      ) : (
                        g.funder
                      )}
                    </dd>
                    {g.amount && (
                      <>
                        <dt className="text-muted">Amount</dt>
                        <dd className="font-medium text-ink">{g.amount}</dd>
                      </>
                    )}
                  </dl>
                </article>
              ))}
            </div>
          </Section>
        ) : null}

        {projects.length ? (
          <Section id="consultancy" eyebrow="Industry" title="Consultancy projects" className="border-t border-line">
            <div className="grid gap-4 lg:grid-cols-3">
              {projects.map((p) => (
                <article key={p.id} className="card p-6">
                  <p className="text-xs text-muted">{p.period}</p>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="text-sm text-muted">
                    {p.client}
                    {p.role && ` · ${p.role}`}
                  </p>
                  {p.responsibilities?.length ? (
                    <>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Responsibilities</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink/80 marker:text-accent">
                        {p.responsibilities.map((r) => (
                          <li key={r.id ?? r.text}>{r.text}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {p.achievements?.length ? (
                    <>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Outcomes</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink/80 marker:text-gold">
                        {p.achievements.map((r) => (
                          <li key={r.id ?? r.text}>{r.text}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </article>
              ))}
            </div>
          </Section>
        ) : null}

        {talks.length ? (
          <Section id="talks" eyebrow="Speaking" title="Talks & workshops" className="border-t border-line">
            <ul className="divide-y divide-line border-y border-line">
              {talks.map((t) => (
                <li key={t.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="w-32 shrink-0 text-sm text-muted">{t.date}</span>
                  <div className="min-w-0">
                    <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-accent">{t.kind === 'keynote' ? 'Keynote' : 'Workshop'}</span>
                    <span className="font-medium text-ink">
                      {t.url ? (
                        <a href={t.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                          {t.title} <ExternalIcon className="inline size-3.5" />
                        </a>
                      ) : (
                        t.title
                      )}
                    </span>
                    {t.organization && <p className="text-sm text-muted">{t.organization}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </div>
    </>
  )
}
