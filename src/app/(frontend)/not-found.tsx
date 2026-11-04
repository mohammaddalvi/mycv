import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="h-display mt-3">Page not found</h1>
        <p className="mt-4 text-muted">The page you are looking for may have moved.</p>
        <Link href="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </div>
  )
}
