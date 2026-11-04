import type { Metadata } from 'next'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { PageHeader, Section } from '@/components/ui'
import { getActivities, getEducation, getProfile } from '@/lib/payload'
import { asMedia, fullName } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile()
  return {
    title: 'About',
    description: `Biography, education, skills and professional service of ${fullName(p)}.`,
    alternates: { canonical: '/about' },
  }
}

export default async function AboutPage() {
  const [p, education, activities] = await Promise.all([getProfile(), getEducation(), getActivities()])
  const affiliations = activities.filter((a) => a.kind === 'affiliation')
  const reviewer = activities.filter((a) => a.kind === 'reviewer')
  const organiser = activities.filter((a) => a.kind === 'organiser')
  const training = activities.filter((a) => a.kind === 'training')
  const awards = activities.filter((a) => a.kind === 'award')
  const photo = asMedia(p.photo)

  return (
    <>
      <PageHeader eyebrow="About" title={fullName(p)} intro={p.headline} />
      <div className="container-x">
        <Section>
          <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
            <div>
              {p.bio ? <RichText data={p.bio} /> : <p className="text-lg text-muted">{p.intro}</p>}
            </div>
            <aside className="space-y-6">
              {photo && (
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
                  <MediaImage media={photo} fill sizes="320px" />
                </div>
              )}
              {p.positions?.length ? (
                <div className="card p-6">
                  <p className="eyebrow mb-3">Current positions</p>
                  <ul className="space-y-3">
                    {p.positions.map((x) => (
                      <li key={x.id ?? x.role}>
                        <p className="font-medium text-ink">{x.role}</p>
                        <p className="text-sm text-muted">
                          {x.url ? (
                            <a href={x.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                              {x.organization}
                            </a>
                          ) : (
                            x.organization
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {affiliations.length ? (
                <div className="card p-6">
                  <p className="eyebrow mb-3">Professional affiliations</p>
                  <ul className="space-y-3 text-sm">
                    {affiliations.map((a) => (
                      <li key={a.id}>
                        <p className="font-medium text-ink">{a.title}</p>
                        <p className="text-muted">{[a.organization, a.date].filter(Boolean).join(' · ')}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </Section>

        {education.length ? (
          <Section eyebrow="Education" title="Academic background" className="border-t border-line">
            <ol className="relative space-y-8 border-l border-line pl-8">
              {education.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[2.4rem] top-1.5 size-3 rounded-full border-2 border-accent bg-paper" />
                  <p className="text-sm text-muted">{e.period}</p>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-ink">
                    {e.degree}, {e.field}
                  </h3>
                  <p className="text-muted">{[e.institution, e.location].filter(Boolean).join(', ')}</p>
                  {e.thesis && (
                    <p className="mt-2 text-sm text-ink/85">
                      <span className="font-medium">Thesis:</span> <em>{e.thesis}</em>
                    </p>
                  )}
                  {e.details && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                      {e.details.split('\n').filter(Boolean).map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </Section>
        ) : null}

        {p.skills?.length ? (
          <Section eyebrow="Skills" title="Methods & tools" className="border-t border-line">
            <div className="grid gap-4 md:grid-cols-2">
              {p.skills.map((s) => (
                <div key={s.id ?? s.group} className="card p-6">
                  <h3 className="mb-3 font-semibold text-ink">{s.group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.items?.map((i) => (
                      <span key={i} className="chip">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {awards.length ? (
          <Section eyebrow="Recognition" title="Awards & honours" className="border-t border-line">
            <ul className="grid gap-3 md:grid-cols-2">
              {awards.map((a) => (
                <li key={a.id} className="card p-5">
                  <p className="font-medium text-ink">{a.title}</p>
                  <p className="text-sm text-muted">{[a.organization, a.date].filter(Boolean).join(' · ')}</p>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {reviewer.length || organiser.length ? (
          <Section eyebrow="Service" title="Professional service" className="border-t border-line">
            <div className="grid gap-8 md:grid-cols-2">
              {organiser.length ? (
                <div>
                  <h3 className="mb-3 font-semibold text-ink">Conference organisation</h3>
                  <ul className="space-y-2 text-muted">
                    {organiser.map((a) => (
                      <li key={a.id}>
                        {a.title}
                        {a.organization && `, ${a.organization}`}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {reviewer.length ? (
                <div>
                  <h3 className="mb-3 font-semibold text-ink">Peer reviewer for</h3>
                  <ul className="columns-1 gap-6 space-y-2 text-muted sm:columns-2 md:columns-1 lg:columns-2">
                    {reviewer.map((a) => (
                      <li key={a.id} className="break-inside-avoid">
                        <em>{a.title}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Section>
        ) : null}

        {training.length ? (
          <Section eyebrow="Development" title="Training & certificates" className="border-t border-line">
            <ul className="grid gap-3 md:grid-cols-2">
              {training.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4 rounded-xl border border-line p-4">
                  <div>
                    <p className="font-medium text-ink">{a.title}</p>
                    <p className="text-sm text-muted">{a.organization}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{a.date}</span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </div>
    </>
  )
}
