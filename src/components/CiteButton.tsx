'use client'

import { useState } from 'react'
import type { Publication } from '@/payload-types'
import { toAPA, toBibTeX } from '@/lib/publications'
import { QuoteIcon } from './Icons'

export function CiteButton({ pub }: { pub: Publication }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(null), 1800)
    } catch {}
  }
  return (
    <>
      <button type="button" className="chip hover:border-accent hover:text-accent" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <QuoteIcon className="mr-1 size-3" /> Cite
      </button>
      {open && (
        <div className="mt-2 basis-full rounded-xl border border-line bg-paper p-4 text-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">APA</p>
          <p className="mb-3 text-ink/90">{toAPA(pub)}</p>
          <pre className="mb-3 overflow-x-auto rounded-lg bg-surface p-3 text-xs leading-relaxed text-ink/90">{toBibTeX(pub)}</pre>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => copy('apa', toAPA(pub))}>
              {copied === 'apa' ? 'Copied ✓' : 'Copy APA'}
            </button>
            <button type="button" className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => copy('bib', toBibTeX(pub))}>
              {copied === 'bib' ? 'Copied ✓' : 'Copy BibTeX'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
