export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 999, background: '#0f5f66', color: '#fff', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 18 }}>
        MD
      </span>
      <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 600 }}>Website admin</span>
    </div>
  )
}
