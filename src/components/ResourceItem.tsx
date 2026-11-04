import type { Resource } from '@/payload-types'
import { DownloadIcon, ExternalIcon, FileIcon } from './Icons'
import { fileExt, fileSize, formatDate } from '@/lib/utils'

export const RESOURCE_KINDS: Record<Resource['kind'], string> = {
  slides: 'Lecture slides',
  notes: 'Lecture notes',
  tutorial: 'Tutorial / lab',
  assignment: 'Assignment',
  dataset: 'Dataset',
  code: 'Code / notebook',
  reading: 'Reading',
  video: 'Video',
  tool: 'Template / tool',
  other: 'Other',
}

export function ResourceItem({ r, showCourse = true }: { r: Resource; showCourse?: boolean }) {
  const course = r.course && typeof r.course === 'object' ? r.course : null
  return (
    <article className="card flex items-start gap-4 p-5">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
        {r.filename ? <span className="text-[0.7rem] font-bold">{fileExt(r.filename) || <FileIcon />}</span> : <ExternalIcon />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap gap-x-3 text-xs text-muted">
          <span className="font-semibold uppercase tracking-wider text-accent">{RESOURCE_KINDS[r.kind]}</span>
          {showCourse && course && <span>{course.title}</span>}
          <span>Updated {formatDate(r.updatedAt)}</span>
        </div>
        <h3 className="font-semibold leading-snug text-ink">{r.title}</h3>
        {r.description && <p className="mt-1 text-sm text-muted">{r.description}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {r.url && (
            <a href={r.url} className="btn-primary !px-4 !py-1.5 text-xs" download={r.filename || true}>
              <DownloadIcon className="size-3.5" /> Download {r.filesize ? `(${fileSize(r.filesize)})` : ''}
            </a>
          )}
          {r.externalUrl && (
            <a href={r.externalUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-1.5 text-xs">
              Open link <ExternalIcon className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
