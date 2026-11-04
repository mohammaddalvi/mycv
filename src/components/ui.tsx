import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="border-b border-line bg-surface/60">
      <div className="container-x py-14 sm:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="h-display max-w-3xl">{title}</h1>
        {intro && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</div>}
        {children}
      </div>
    </section>
  )
}

export function Section({ id, title, eyebrow, children, className, action }: { id?: string; title?: string; eyebrow?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section id={id} className={cx('scroll-mt-24 py-12 sm:py-16', className)}>
      {(title || eyebrow) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            {title && <h2 className="h-section">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="card p-8 text-center text-muted">{children}</p>
}
