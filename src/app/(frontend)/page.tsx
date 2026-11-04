import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { PostCard } from '@/components/PostCard'
import { PublicationItem } from '@/components/Publication'
import { ArrowRight, DownloadIcon } from '@/components/Icons'
import { Section } from '@/components/ui'
import { getCourses, getExperiences, getGrants, getPosts, getProfile, getPublications, getSupervisions } from '@/lib/payload'
import { asMedia, asResource, fullName } from '@/lib/utils'

export default async function HomePage() {
  const [p, pubs, posts, courses, supervisions, grants, experiences] = await Promise.all([
    getProfile(),
    getPublications(),
    getPosts(3),
    getCourses(),
    getSupervisions(),
    getGrants(),
    getExperiences(),
  ])
  const featured = pubs.filter((x) => x.featured).slice(0, 4)
  const shownPubs = featured.length ? featured : pubs.slice(0, 4)
  const photo = asMedia(p.photo)
  const cv = asResource(p.cv)
  const firstYear = Math.min(...experiences.map((e) => new Date(e.startDate).getUTCFullYear()), new Date().getUTCFullYear())
  const years = new Date().getUTCFullYear() - firstYear
  const stats = [
    { value: pubs.length, label: 'Publications' },
    { value: supervisions.length, label: 'Theses supervised' },
    { value: grants.length, label: 'Research grants' },
    { value: `${p.yearsOfExperience || Math.max(years, 1)}+`, label: 'Years of experience' },
  ]
  const taught = courses.filter((c) => c.status === 'taught').slice(0, 3)
  const authorNames = p.authorNames || []

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-accent/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-32 size-[28rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.35fr_1fr]">
          <div>
            {p.positions?.length ? (
              <p className="eyebrow mb-4">{p.positions.map((x) => x.organization.replace(/\s*\(.*\)/, '')).join(' · ')}</p>
            ) : null}
            <h1 className="h-display text-[2.6rem] sm:text-6xl">{fullName(p)}</h1>
            {p.headline && <p className="mt-4 text-xl font-medium text-ink/80">{p.headline}</p>}
            {p.intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{p.intro}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/publications" className="btn-primary">
                View publications <ArrowRight className="size-4" />
              </Link>
              {cv?.url ? (
                <a href={cv.url} className="btn-ghost" download>
                  <DownloadIcon className="size-4" /> Download CV
                </a>
              ) : (
                <Link href="/contact" className="btn-ghost">
                  Get in touch
                </Link>
              )}
            </div>
            {p.links?.length ? (
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {p.links.map((l) => (
                  <li key={l.id ?? l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer me" className="link">
                      {l.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            {photo ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line shadow-2xl shadow-black/10">
                <MediaImage media={photo} fill priority sizes="(min-width: 1024px) 420px, 90vw" />
              </div>
            ) : (
              <div className="card relative overflow-hidden p-8 shadow-xl shadow-black/5">
                <p className="eyebrow mb-5">Research focus</p>
                <ul className="space-y-3">
                  {p.researchInterests?.slice(0, 6).map((r) => (
                    <li key={r.id ?? r.title} className="flex items-start gap-3">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
                      <span className="font-serif text-lg text-ink">{r.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-surface">
        <dl className="container-x grid grid-cols-2 divide-line py-8 md:grid-cols-4 md:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse px-4 py-3 text-center">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">{s.label}</dt>
              <dd className="font-serif text-3xl font-semibold text-accent sm:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="container-x">
        {/* Research interests */}
        {p.researchInterests?.length ? (
          <Section eyebrow="Research" title="Areas of expertise">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.researchInterests.map((r, i) => (
                <div key={r.id ?? r.title} className="card p-6 transition hover:border-accent/50">
                  <span className="font-serif text-sm font-semibold text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-ink">{r.title}</h3>
                  {r.description && <p className="mt-2 text-sm leading-relaxed text-muted">{r.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Featured publications */}
        {shownPubs.length ? (
          <Section
            eyebrow="Publications"
            title="Selected work"
            action={
              <Link href="/publications" className="link inline-flex items-center gap-1 text-sm">
                All {pubs.length} publications <ArrowRight className="size-4" />
              </Link>
            }
          >
            <div className="card divide-y divide-line px-6">
              {shownPubs.map((pub) => (
                <PublicationItem key={pub.id} pub={pub} authorNames={authorNames} />
              ))}
            </div>
          </Section>
        ) : null}

        {/* Blog */}
        {posts.length ? (
          <Section
            eyebrow="Blog"
            title="Latest writing"
            action={
              <Link href="/blog" className="link inline-flex items-center gap-1 text-sm">
                All posts <ArrowRight className="size-4" />
              </Link>
            }
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </Section>
        ) : null}

        {/* Teaching */}
        {taught.length ? (
          <Section
            eyebrow="Teaching"
            title="Courses"
            action={
              <Link href="/teaching" className="link inline-flex items-center gap-1 text-sm">
                Teaching & supervision <ArrowRight className="size-4" />
              </Link>
            }
          >
            <div className="grid gap-4 md:grid-cols-3">
              {taught.map((c) => (
                <Link key={c.id} href={`/teaching/${c.slug}`} className="card group p-6 transition hover:border-accent/50">
                  <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-accent">{c.title}</h3>
                  {c.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{c.summary}</p>}
                </Link>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </>
  )
}
