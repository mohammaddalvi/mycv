import { ImageResponse } from 'next/og'
import { getProfile } from '@/lib/payload'
import { fullName } from '@/lib/utils'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Profile card'

export default async function OG() {
  const p = await getProfile()
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg,#0c131a 0%,#0f5f66 100%)', color: '#fff' }}>
        <div style={{ fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: '#9fe0dd' }}>{p.positions?.[0]?.organization || 'Academic profile'}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>{fullName(p)}</div>
          <div style={{ fontSize: 34, marginTop: 20, color: '#d8e6e8' }}>{p.headline}</div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 24, color: '#e0a84a' }}>
          {(p.researchInterests || []).slice(0, 4).map((r) => (
            <span key={r.title}>{r.title} ·</span>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
