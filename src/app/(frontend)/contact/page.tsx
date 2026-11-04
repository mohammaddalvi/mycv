import type { Metadata } from 'next'
import { ExternalIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/Icons'
import { PageHeader } from '@/components/ui'
import { getProfile } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact details for research collaboration, supervision enquiries, speaking and consultancy.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const p = await getProfile()
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        intro="I welcome enquiries about research collaboration, postgraduate supervision, invited talks and industry consultancy."
      />
      <div className="container-x grid gap-6 py-12 md:grid-cols-2">
        <div className="card space-y-6 p-8">
          {p.email && (
            <a href={`mailto:${p.email}`} className="group flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><MailIcon /></span>
              <span>
                <span className="block text-sm text-muted">Email</span>
                <span className="font-medium text-ink group-hover:text-accent">{p.email}</span>
                {p.secondaryEmail && <span className="block text-sm text-muted">{p.secondaryEmail}</span>}
              </span>
            </a>
          )}
          {p.phone && (
            <a href={`tel:${p.phone.replace(/[^+\d]/g, '')}`} className="group flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><PhoneIcon /></span>
              <span>
                <span className="block text-sm text-muted">Phone</span>
                <span className="font-medium text-ink group-hover:text-accent">{p.phone}</span>
              </span>
            </a>
          )}
          {p.address && (
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><PinIcon /></span>
              <span>
                <span className="block text-sm text-muted">Office</span>
                <address className="whitespace-pre-line not-italic text-ink">{p.address}</address>
              </span>
            </div>
          )}
        </div>
        <div className="card p-8">
          <p className="eyebrow mb-4">Academic profiles</p>
          <ul className="divide-y divide-line">
            {p.links?.map((l) => (
              <li key={l.id ?? l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer me" className="flex items-center justify-between py-3 font-medium text-ink hover:text-accent">
                  {l.platform} <ExternalIcon className="size-4 text-muted" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
