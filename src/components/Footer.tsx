import Link from 'next/link'
import type { Profile } from '@/payload-types'
import { NAV } from '@/lib/nav'
import { fullName } from '@/lib/utils'

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-lg font-semibold text-ink">{fullName(profile)}</p>
          {profile.headline && <p className="mt-1 text-sm text-muted">{profile.headline}</p>}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="link mt-4 inline-block text-sm">
              {profile.email}
            </a>
          )}
        </div>
        <div>
          <p className="eyebrow mb-3">Explore</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Profiles</p>
          <ul className="space-y-2 text-sm">
            {profile.links?.map((l) => (
              <li key={l.id ?? l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer me" className="text-muted hover:text-ink">
                  {l.platform}
                </a>
              </li>
            ))}
            <li>
              <a href="/feed.xml" className="text-muted hover:text-ink">
                Blog RSS feed
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <Link href="/admin" className="hover:text-ink" prefetch={false}>
            Admin login
          </Link>
        </div>
      </div>
    </footer>
  )
}
