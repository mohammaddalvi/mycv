import Link from 'next/link'

const quick = [
  { href: '/admin/collections/posts/create', label: 'Write a blog post' },
  { href: '/admin/collections/publications/create', label: 'Add a publication' },
  { href: '/admin/collections/resources/create', label: 'Upload teaching material' },
  { href: '/admin/collections/experiences/create', label: 'Add experience' },
  { href: '/admin/globals/profile', label: 'Edit profile, photo & CV' },
]

export default function Welcome() {
  return (
    <div style={{ marginBottom: 32, padding: 24, borderRadius: 12, border: '1px solid var(--theme-elevation-150)', background: 'var(--theme-elevation-50)' }}>
      <h2 style={{ margin: 0, fontSize: 22 }}>Welcome back 👋</h2>
      <p style={{ margin: '8px 0 16px', color: 'var(--theme-elevation-600)' }}>
        Changes you save here appear on the public site within seconds.{' '}
        <a href="/" target="_blank" rel="noreferrer">
          View website ↗
        </a>
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {quick.map((q) => (
          <Link key={q.href} href={q.href} style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid var(--theme-elevation-250)', background: 'var(--theme-elevation-0)', color: 'var(--theme-text)', textDecoration: 'none', fontSize: 14 }}>
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
