'use client'

import { useMemo, useState } from 'react'
import type { Resource } from '@/payload-types'
import { RESOURCE_KINDS, ResourceItem } from './ResourceItem'
import { cx } from '@/lib/utils'
import { SearchIcon } from './Icons'

export function ResourceBrowser({ resources }: { resources: Resource[] }) {
  const [kind, setKind] = useState('all')
  const [course, setCourse] = useState('all')
  const [q, setQ] = useState('')

  const kinds = useMemo(() => Array.from(new Set(resources.map((r) => r.kind))), [resources])
  const courses = useMemo(() => {
    const m = new Map<string, string>()
    for (const r of resources) if (r.course && typeof r.course === 'object') m.set(String(r.course.id), r.course.title)
    return Array.from(m.entries())
  }, [resources])

  const filtered = resources.filter((r) => {
    const cid = r.course && typeof r.course === 'object' ? String(r.course.id) : ''
    const needle = q.trim().toLowerCase()
    return (
      (kind === 'all' || r.kind === kind) &&
      (course === 'all' || cid === course) &&
      (!needle || `${r.title} ${r.description ?? ''}`.toLowerCase().includes(needle))
    )
  })

  if (!resources.length)
    return (
      <div className="card p-10 text-center">
        <p className="font-serif text-xl text-ink">Materials are on the way.</p>
        <p className="mt-2 text-muted">Lecture slides, datasets and readings will appear here as they are published.</p>
      </div>
    )

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', ...kinds].map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={cx(
                'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
                kind === k ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface text-muted hover:text-ink',
              )}
            >
              {k === 'all' ? 'All' : RESOURCE_KINDS[k as Resource['kind']]}
            </button>
          ))}
        </div>
        <div className="flex flex-1 gap-2 md:justify-end">
          <label className="relative min-w-0 flex-1 md:max-w-xs">
            <span className="sr-only">Search resources</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </label>
          {courses.length ? (
            <label>
              <span className="sr-only">Course</span>
              <select value={course} onChange={(e) => setCourse(e.target.value)} className="max-w-[12rem] rounded-full border border-line bg-surface px-3 py-2 text-sm text-ink">
                <option value="all">All courses</option>
                {courses.map(([id, title]) => (
                  <option key={id} value={id}>
                    {title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((r) => (
          <ResourceItem key={r.id} r={r} />
        ))}
      </div>
      {!filtered.length && <p className="card p-8 text-center text-muted">Nothing matches those filters.</p>}
    </div>
  )
}
