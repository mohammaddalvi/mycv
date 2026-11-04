export function ShareLinks({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const links = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: 'Email', href: `mailto:?subject=${t}&body=${u}` },
  ]
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted">Share:</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="chip hover:border-accent hover:text-accent">
          {l.label}
        </a>
      ))}
    </div>
  )
}
