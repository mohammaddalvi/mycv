'use client'

import { useMemo, useState } from 'react'
import type { Publication } from '@/payload-types'
import { cx } from '@/lib/utils'
import { SearchIcon } from './Icons'
import { PublicationItem } from './Publication'

type TypeCount = { value: Publication['type']; plural: string; count: number }

export function PublicationBrowser({ pubs, types, authorNames }: { pubs: Publication[]; types: TypeCount[]; authorNames: string[] }) {
  const [type, setType] = useState<string>('all')
  const [year, setYear] = useState<string>('all')
  const [q, setQ] = useState('')

  const years = useMemo(() => Array.from(new Set(pubs.map((p) => p.year))).sort((a, b) => b - a), [pubs])
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return pubs.filter(
      (p) =>
        (type === 'all' || p.type === type) &&
        (year === 'all' || String(p.year) === year) &&
        (!needle || `${p.title} ${p.authors} ${p.venue ?? ''} ${(p.keywords || []).join(' ')}`.toLowerCase().includes(needle)),
    )
  }, [pubs, type, year, q])

  const byYear = useMemo(() => {
    const m = new Map<number, Publication[]>()
    for (const p of filtered) m.set(p.year, [...(m.get(p.year) || []), p])
    return Array.from(m.entries()).sort((a, b) => b[0] - a[0])
  }, [filtered])

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 mb-6 border-b border-line bg-paper/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div role="tablist" aria-label="Publication type" className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {[{ value: 'all', plural: 'All', count: pubs.length }, ...types].map((t) => (
              <button
                key={t.value}
                role="tab"
                aria-selected={type === t.value}
                onClick={() => setType(t.value)}
                className={cx(
                  'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
                  type === t.value ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface text-muted hover:text-ink',
                )}
              >
                {t.plural} <span className="opacity-70">{t.count}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-1 gap-2 lg:justify-end">
            <label className="relative min-w-0 flex-1 lg:max-w-xs">
              <span className="sr-only">Search publications</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search title, author, journal…"
                className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </label>
            <label>
              <span className="sr-only">Year</span>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-full border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              >
                <option value="all">All years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted" aria-live="polite">
        Showing {filtered.length} of {pubs.length}
      </p>

      {byYear.length === 0 && <p className="card p-8 text-center text-muted">No publications match your filters.</p>}

      <div className="space-y-10">
        {byYear.map(([y, items]) => (
          <section key={y} aria-labelledby={`y-${y}`} className="grid gap-2 md:grid-cols-[6rem_1fr]">
            <h2 id={`y-${y}`} className="font-serif text-3xl font-semibold text-accent/80 md:sticky md:top-44 md:self-start">
              {y}
            </h2>
            <div className="divide-y divide-line border-t border-line md:border-t-0">
              {items.map((p) => (
                <div key={p.id} id={`pub-${p.id}`} className="scroll-mt-40">
                  <PublicationItem pub={p} authorNames={authorNames} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
